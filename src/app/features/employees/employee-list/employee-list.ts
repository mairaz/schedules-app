import { Component, computed, inject, resource, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MockData } from '../../../data/mock-data';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { User } from '../../../core/models/user';
import { PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-employee-list',
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private router = inject(Router);
  dataService = inject(MockData);

  readonly displayedColumns: string[] = ['id', 'name', 'position', 'email', 'actions'];
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  readonly sortActive = signal('id');
  readonly sortDirection = signal<SortDirection>('desc');
  readonly pageIndex = signal(0);

  readonly employeesResource = rxResource({
    params: () => ({
      sort: this.sortActive(),
      order: this.sortDirection(),
      page: this.pageIndex(),
    }),
    stream: ({ params }) =>
      this.dataService.employees(params.sort, params.order || 'asc', params.page).pipe(
        map((response: PaginatedResponse<User[]>) => ({
          items: response.data,
          total_count: response.items,
        })))
  });

  readonly isLoadingResults = this.employeesResource.isLoading;
  readonly data = computed(() => {
    return this.employeesResource.value()?.items || [];
  });

  readonly resultsLength = computed(() => this.employeesResource.value()?.total_count || 0);

  handleSort() {
    this.paginator().pageIndex = 0;
    this.pageIndex.set(0);
    this.sortActive.set(this.sort().active);
    this.sortDirection.set(this.sort().direction);
  }

  handlePage() {
    this.pageIndex.set(this.paginator().pageIndex);
  }

  addEmployee() {
    this.router.navigate(['/home/employees/new']);
  }

  editEmployee(id: number) {
    this.router.navigate(['/home/employees', id, 'edit']);
  }
}



