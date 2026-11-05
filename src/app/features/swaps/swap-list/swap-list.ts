import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { MockData } from '../../../data/mock-data';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../../core/auth';
import { Employee } from '../../../core/models';
import { ShiftSchedule } from '../../../core/models/shiftSchedule';
import { SwapRequestView } from '../../../core/models/swap-request-view';
import { SwapService } from '../swap.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-swap-list',
  imports: [MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './swap-list.html',
  styleUrl: './swap-list.scss',
})
export class SwapList implements OnInit {
  readonly dataService = inject(MockData);
  readonly auth = inject(Auth);
  currentUser = signal(inject(Auth).currentUser());
  swapService = inject(SwapService)
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  currentEmployee = this.dataService.currentEmployee;
  currentEmployeeTurnos = signal<ShiftSchedule[]>([]);
  private loadShifts = effect(() => {
    if (!this.currentEmployee()) return;
    this.getShifts();
  });
  swapRequests = signal<SwapRequestView[]>([]);

  ngOnInit() {
    this.loadRequests();
  }

  requireSwap(request: SwapRequestView) {
    const employee = this.currentEmployee();

    if (!this.currentUser()) {
      this.showError('You must be logged in to apply for a swap.');
      return;
    }
    if (!employee) {
      this.showError('Your employee profile could not be found.');
      return;
    }

    const blockReason = this.getApplyBlockReason(employee, request);
    if (blockReason) {
      this.showError(blockReason);
      return;
    }

    this.swapService.apply({
      employeeId: employee.id,
      swapsRequestId: request.id,
      status: 'pending',
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showSuccess('Application sent!');
          this.loadRequests();
        },
        error: () => this.showError('Could not send your application. Please try again.'),
      });
  }

  private getApplyBlockReason(employee: Employee, request: SwapRequestView): string | null {
    const { shift } = request;

    if (request.status !== 'pending') {
      return 'This swap request is no longer open.';
    }
    if (shift?.employeeId === employee.id) {
      return 'You cannot apply to your own swap request.';
    }
    if (request.swapsApplications.some((application) => application.employeeId === employee.id)) {
      return 'You already applied to this swap.';
    }
    if (employee.position !== request.requester?.position) {
      return 'Your position does not match the one required for this shift.';
    }
    if (!shift) return null;

    if (this.currentEmployeeTurnos().some((turno) => turno.day === shift.day && turno.shift === shift.shift)) {
      return 'You already have a shift at that time.';
    }

    const dayAvailability = employee.availability?.[shift.day];
    if (!dayAvailability || dayAvailability.unavailable) {
      return 'You are unavailable on that day.';
    }
    if (!dayAvailability[shift.shift]) {
      return 'You are not available for this shift period.';
    }
    return null;
  }

  getShifts() {
    const employeeId = this.currentEmployee()?.id
    if (!employeeId) return
    this.dataService.getShiftsByEmployeeId(employeeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (shifts) => this.currentEmployeeTurnos.set(shifts),
        error: () => this.showError('Could not load swap requests. Please try again.')
      });
  }

  loadRequests() {
    this.swapService.getRequestsView()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (requests) => this.swapRequests.set(requests),
        error: () => this.showError('Could not load swap requests. Please try again.'),
      });
  }
  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 4000 });
  }
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 4000 });
  }
}
