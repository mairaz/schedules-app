import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class MockData {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);

  employees(sort: string, order: 'asc' | 'desc', page: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?_role=employee&_sort=${sort}&_order=${order}&_page=${page + 1}`);
  }
}
