import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwapApplicationView, SwapRequestView } from '../../../core/models';
import { SwapService } from '../swap.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-swap-approvals',
  imports: [MatCardModule, MatChipsModule, MatButtonModule],
  templateUrl: './swap-approvals.html',
  styleUrl: './swap-approvals.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapApprovals implements OnInit {
  private readonly swapService = inject(SwapService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  readonly swapRequests = signal<SwapRequestView[]>([]);

  ngOnInit() {
    this.loadRequests();
  }

  select(request: SwapRequestView, application: SwapApplicationView) {
    // Writes are not tied to the component's lifetime: cancelling a half-finished
    // approval would leave the data inconsistent.
    this.swapService.approve(request, application).subscribe({
      next: () => {
        this.notify('User Selected');
        this.loadRequests();
      },
      error: () => {
        this.notify('Could not approve the swap request.');
        this.loadRequests();
      },
    })
  }

  reject(request: SwapRequestView) {
    this.swapService.reject(request).subscribe({
      next: () => {
        this.notify('Swap was successfully rejected.');
        this.loadRequests();
      },
      error: () => {
        this.notify('Could not reject the swap request.');
        this.loadRequests();
      },
    })
  }

  private loadRequests() {
    this.swapService.getRequestsView()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (requests) => {
          this.swapRequests.set(requests)
        },
        error: () => {
          this.notify('Could not load swap requests. Please try again.');
        },
      });
  }

  private notify(message: string) {
    this.snackBar.open(message, 'Close', { duration: 4000 });
  }
}
