import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../core/models/user';
import { Employee, PaginatedResponse } from '../core/models';
import { map } from 'rxjs/internal/operators/map';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShiftSchedule } from '../core/models/shiftSchedule';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  employeesData = toSignal(
    this.getEmployeesPaginated('name', 'asc', 0),
    {
      initialValue: {
        data: [],
        first: 0,
        prev: null,
        next: null,
        last: 0,
        pages: 0,
        items: 0,
      },
    }
  );
  employees = computed(() => this.employeesData().data);

  getEmployeesPaginated(sort: string, order: 'asc' | 'desc', page: number): Observable<PaginatedResponse<Employee>> {
    return this.http.get<PaginatedResponse<Employee>>(`${this.baseUrl}/users?role=employee&_sort=${sort}&_order=${order}&_page=${page + 1}`)
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee[]>(`${this.baseUrl}/users?id=${id}`).pipe(
      map(users => users[0])
    );
  }

  updateEmployee(id: number, employeeData: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/users/${id}`, employeeData);
  }

  createEmployee(employeeData: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/users`, employeeData);
  }

  getShiftsByEmployeeId(employeeId: number): Observable<ShiftSchedule[]> {
    return this.http.get<ShiftSchedule[]>(`${this.baseUrl}/shifts?employeeId=${employeeId}`);
  }

  getShifts() {
    return this.http.get<ShiftSchedule[]>(`${this.baseUrl}/shifts`);
  }

  addShifts(employeeShift: ShiftSchedule): Observable<ShiftSchedule> {
    return this.http.post<ShiftSchedule>(`${this.baseUrl}/shifts`, employeeShift)
  }
}
