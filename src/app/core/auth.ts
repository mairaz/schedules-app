import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs'

export interface User { email: string; role: string; name: string; id: number; }

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly currentUser = signal<User | null>(null);

  http = inject(HttpClient);
  login(email: string): Observable<User[]> {
    console.log('Attempting login for email:', email);
    return this.http.get<User[]>(`http://localhost:3000/users/?email=${email}`).pipe(tap(user => {
      this.currentUser.set(user[0])
    }))
  }
}
