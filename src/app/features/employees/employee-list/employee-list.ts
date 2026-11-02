import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MockData } from '../../../data/mock-data';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Employee, EmployeeFilters, PaginatedResponse } from '../../../core/models';

@Component({
  selector: 'app-employee-list',
  imports: [MatPaginatorModule, MatSortModule, MatTableModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private router = inject(Router);
  dataService = inject(MockData);
  readonly displayedColumns: string[] = ['id', 'name', 'position', 'email', 'actions'];
  readonly paginator = viewChild.required(MatPaginator);
  readonly filter = signal<EmployeeFilters>({});
  readonly sort = viewChild.required(MatSort);
  readonly sortActive = signal('id');
  readonly sortDirection = signal<SortDirection>('desc');
  readonly pageIndex = signal(0);
  readonly uniquePositions = ["Cook", "Bartender", "Server", "Manager", "Host", "Dishwasher", "Busser", "Barista", "Line Cook", "Prep Cook", "Sous Chef", "Pastry Chef", "Sommelier", "Expediter", "Food Runner"];
  readonly nameControl = new FormControl('', { nonNullable: true });

  readonly employeesResource = rxResource({
    params: () => ({
      sort: this.sortActive(),
      order: this.sortDirection(),
      page: this.pageIndex(),
      filter: this.filter()
    }),
    stream: ({ params }) =>
      this.dataService.getEmployeesPaginated(params.sort, params.order || 'asc', params.page, params.filter).pipe(
        map((response: PaginatedResponse<Employee>) => ({
          items: response.data,
          total_count: response.items,
        })))
  });

  readonly isLoadingResults = this.employeesResource.isLoading;
  readonly data = computed(() => {
    return this.employeesResource.value()?.items || [];
  });

  readonly resultsLength = computed(() => this.employeesResource.value()?.total_count || 0);

  constructor() {
    this.nameControl.valueChanges.pipe(
      map((name) => name.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe((name) => this.setFilter('name', name))
  }

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

  editEmployee(id: string) {
    this.router.navigate(['/home/employees', id, 'edit']);
  }

  setFilter(key: keyof EmployeeFilters, value: string) {
    if ((this.filter()[key] ?? '') === value) return;
    this.paginator().pageIndex = 0;
    this.pageIndex.set(0);
    this.filter.set({ ...this.filter(), [key]: value });
  }
}


