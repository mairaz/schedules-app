import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../core/models/user';
import { PaginatedResponse } from '../core/models';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);

  employees(sort: string, order: 'asc' | 'desc', page: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?role=employee&_sort=${sort}&_order=${order}&_page=${page + 1}`);
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
}
