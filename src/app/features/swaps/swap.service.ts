import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { defaultIfEmpty, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CreateSwapApplication, SwapApplication, SwapRequest, SwapRequestView } from '../../core/models';
import { ShiftSchedule } from '../../core/models/shiftSchedule';
import { MockData } from '../../data/mock-data';
import { environment } from '../../../environments/environment';
import { EmployeeList } from '../employees/employee-list/employee-list';

// Shape returned by json-server when using `_expand=shift` and `_embed=swapsApplications`.
type SwapRequestResponse = SwapRequest & {
  shift?: ShiftSchedule;
  swapsApplications: SwapApplication[];
};

@Injectable({ providedIn: 'root' })
export class SwapService {
  private readonly http = inject(HttpClient);
  private readonly dataService = inject(MockData);
  private readonly baseUrl = environment.apiUrl;

  getRequestsView(): Observable<SwapRequestView[]> {
    return forkJoin({
      requests: this.http.get<SwapRequestResponse[]>(`${this.baseUrl}/swapsRequests?_expand=shift&_embed=swapsApplications`),
      employees: this.dataService.getAllEmployees(),
    }).pipe(
      map(({ requests, employees }) => {
        const employeeById = new Map(employees.map((employee) => [employee.id, employee]));

        return requests.map(({ swapsApplications, shift, ...request }) => ({
          ...request,
          shift,
          requester: shift && employeeById.get(shift.employeeId),
          swapsApplications: swapsApplications.map((application) => ({
            ...application,
            applicant: employeeById.get(application.employeeId),
          })),
        }));
      }),
    );
  }

  apply(application: CreateSwapApplication): Observable<SwapApplication> {
    return this.http.post<SwapApplication>(`${this.baseUrl}/swapsApplications`, application);
  }

  approve(request: SwapRequestView, chosen: SwapApplication): Observable<SwapRequest> {
    if (chosen.swapsRequestId !== request.id) {
      return throwError(() => new Error('This application does not belong to this swap request.'));
    }
    if (request.status !== 'pending') {
      return throwError(() => new Error('This request is no longer pending.'));
    }

    return this.http.patch<ShiftSchedule>(`${this.baseUrl}/shifts/${request.shiftId}`, { employeeId: chosen.employeeId }).pipe(switchMap(() => {
      return forkJoin(request.swapsApplications.map((application) =>
        this.http.patch<SwapApplication>(`${this.baseUrl}/swapsApplications/${application.id}`, {
          status: application.id === chosen.id ? 'approved' : 'rejected',
        })
      ))
    })).pipe(switchMap(() => {
      return this.http.patch<SwapRequest>(`${this.baseUrl}/swapsRequests/${request.id}`, { status: 'approved' })
    }));
  }


  reject(request: SwapRequestView): Observable<SwapRequest> {
    if (request.status !== 'pending') {
      return throwError(() => new Error('This request is no longer pending.'));
    }
    return forkJoin(
      request.swapsApplications.map((application) =>
        this.http.patch<SwapApplication>(`${this.baseUrl}/swapsApplications/${application.id}`, { status: 'rejected' }),
      ),
    ).pipe(
      defaultIfEmpty([]),
      switchMap(() => this.http.patch<SwapRequest>(`${this.baseUrl}/swapsRequests/${request.id}`, { status: 'rejected' })),
    );
  }
}
