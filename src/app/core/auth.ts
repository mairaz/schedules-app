import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs'

export interface User { name: string; role: string; }

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly currentUser = signal<User | null>(null);

  http = inject(HttpClient);
  login(email: string, role: string): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/users/?email=${email}`).pipe(tap(user => {
      this.currentUser.set(user[0])
    }))
  }
}
