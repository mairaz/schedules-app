import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../core/models/user';
import { PaginatedResponse } from '../core/models';
import { map } from 'rxjs/internal/operators/map';
import { Shift } from '../core/models/shift';
import { shareReplay, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);
  employeesData = toSignal(
    this.employees('name', 'asc', 0),
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
  users = computed(() => this.employeesData().data);


  employees(sort: string, order: 'asc' | 'desc', page: number): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/users?role=employee&_sort=${sort}&_order=${order}&_page=${page + 1}`)
  }

  getEmployeeById(id: number): Observable<User> {
    return this.http.get<User[]>(`${this.baseUrl}/users?id=${id}`).pipe(
      map(users => users[0])
    );
  }

  updateEmployee(id: number, employeeData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}`, employeeData);
  }

  createEmployee(employeeData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, employeeData);
  }

  getShiftsByEmployeeId(employeeId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.baseUrl}/shifts?employeeId=${employeeId}`);
  }

  getShifts() {
    return this.http.get<Shift[]>(`${this.baseUrl}/shifts`);
  }

  addShifts(employeeShift: Shift): Observable<Shift> {
    return this.http.post<Shift>(`${this.baseUrl}/shifts`, employeeShift)
  }
}
