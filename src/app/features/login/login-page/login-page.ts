import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Auth } from '../../../core/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'login-page',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  fb = inject(FormBuilder);
  auth = inject(Auth);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required]
  })

  enter() {
    if (this.form.invalid) return;
    const { email } = this.form.getRawValue();
    this.auth.login(email).subscribe({
      next: (user) => {
        console.log('Success')
        this.router.navigateByUrl(user[0].role === 'manager' ? '/home/employees' : '/home/my-schedule');

      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
}
