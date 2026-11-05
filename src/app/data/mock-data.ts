import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Employee, EmployeeFilters, PaginatedResponse } from '../core/models';
import { map } from 'rxjs/internal/operators/map';
import { toSignal } from '@angular/core/rxjs-interop';
import { CreateShiftSchedule, ShiftSchedule } from '../core/models/shiftSchedule';
import { switchMap, tap } from 'rxjs';
import { Auth } from '../core/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  readonly authService = inject(Auth)
  baseUrl = environment.apiUrl;
  readonly pageSize = 10;
  http = inject(HttpClient);
  currentEmployee = computed(() =>
    this.employees().find(emp => emp?.userId === this.authService.currentUser()?.id)
  )
  employeesData = toSignal(
    this.getAllEmployees(),
    {
      initialValue: []
    }
  );
  employees = computed(() => this.employeesData());
  shifts = signal<ShiftSchedule[]>([]);

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`)
  }

  getEmployeesPaginated(sort: string, order: 'asc' | 'desc', page: number, filter: EmployeeFilters): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams()
      .set('_sort', sort)
      .set('_order', order)
      .set('_page', String(page + 1))
      .set('_limit', String(this.pageSize));

    Object.entries(filter).forEach(([key, value]) => {
      if (value) {
        params = params.set(key === 'name' ? 'name_like' : key, value);
      }
    });

    return this.http.get<Employee[]>(`${this.baseUrl}/employees`, { params, observe: 'response' }).pipe(
      map((response) => {
        const total = Number(response.headers.get('X-Total-Count') ?? 0);
        const pages = Math.max(1, Math.ceil(total / this.pageSize));
        const current = page + 1;
        return {
          first: 1,
          prev: current > 1 ? current - 1 : null,
          next: current < pages ? current + 1 : null,
          last: pages,
          pages,
          items: total,
          data: response.body ?? [],
        };
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`, { params }).pipe(
      map(employees => employees[0])
    );
  }

  updateEmployee(id: string, employeeData: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/employees/${id}`, employeeData);
  }

  createEmployee(employeeData: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, employeeData);
  }

  getShiftsByEmployeeId(employeeId: string): Observable<ShiftSchedule[]> {
    const params = new HttpParams().set('employeeId', employeeId);
    return this.http.get<ShiftSchedule[]>(`${this.baseUrl}/shifts`, { params });
  }

  getShifts(): Observable<ShiftSchedule[]> {
    return this.http.get<ShiftSchedule[]>(`${this.baseUrl}/shifts`).pipe(
      tap((res) => this.shifts.set(res))
    );
  }

  addShifts(employeeShift: CreateShiftSchedule): Observable<ShiftSchedule> {
    return this.http.post<ShiftSchedule>(`${this.baseUrl}/shifts`, employeeShift).pipe(
      switchMap((created) => this.getShifts().pipe(map(() => created)))
    );
  }
}
