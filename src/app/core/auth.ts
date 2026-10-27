import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs'
import { environment } from '../../environments/environment';
import { User } from './models/user';


@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly baseUrl = environment.apiUrl;
  readonly currentUser = signal<User | null>(null);
  http = inject(HttpClient);

  login(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/?email=${email}`).pipe(tap(user => {
      this.currentUser.set(user[0])
    }));
  }
}
