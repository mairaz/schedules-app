import { Component, computed, inject, resource, signal, viewChild } from '@angular/core';
import { MockData } from '../../../data/mock-data';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PaginatedResponse, User } from '../../../core/models';

@Component({
  selector: 'app-employee-list',
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  dataService = inject(MockData);

  readonly displayedColumns: string[] = ['id', 'name', 'role', 'email'];
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
        map((response: PaginatedResponse<User>) => ({
          items: response.data ?? [],
          total_count: response.items ?? 0,
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
}



