import { Routes } from '@angular/router';

import { LoginPage } from './features/login/login-page/login-page';
import { Shell } from './layout/shell/shell';
import { roleGuard } from './core/role-guard';


export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: 'home', component: Shell,
    children: [
      {
        path: 'employees',
        canActivate: [roleGuard],
        data: { role: ['manager'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/employees/employee-list/employee-list')
              .then(m => m.EmployeeList)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/employees/employee-form/employee-form')
              .then(m => m.EmployeeForm)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/employees/employee-form/employee-form')
              .then(m => m.EmployeeForm)
          }
        ]
      },
      {
        path: 'schedules',
        data: { role: ['manager'] },
        loadComponent: () => import('./features/schedules/weekly-schedule/weekly-schedule')
          .then(m => m.WeeklySchedule)

      },
      {
        path: 'swaps/approvals',
        data: { role: ['manager'] },
        canActivate: [roleGuard],
        loadComponent: () => import('./features/swaps/swap-approvals/swap-approvals')
          .then(m => m.SwapApprovals)
      },
      {
        path: 'swaps',
        data: { role: ['manager', 'employee'] },
        canActivate: [roleGuard],
        loadComponent: () => import('./features/swaps/swap-list/swap-list')
          .then(m => m.SwapList)

      },
      {
        path: 'my-schedule',
        data: { role: ['manager', 'employee'] },
        canActivate: [roleGuard],
        loadComponent: () => import('./features/my-schedule/my-schedule-page/my-schedule-page')
          .then(m => m.MySchedulePage)

      }
    ]
  }
];
