import { Component, inject, signal } from '@angular/core';
import { MockData } from '../../../data/mock-data';
import { Auth } from '../../../core/auth';
import { DAYS_OF_WEEK, SHIFTS } from '../../../core/models/availability';
import type { Shift } from '../../../core/models/shift';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-schedule-page',
  imports: [MatButtonModule],
  templateUrl: './my-schedule-page.html',
  styleUrl: './my-schedule-page.scss',
})
export class MySchedulePage {
  dataService = inject(MockData);
  currentUser = signal(inject(Auth).currentUser());

  days = DAYS_OF_WEEK;
  shifts = SHIFTS;
  turnos = signal<Shift[]>([]);

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.getShifts(user.id);
    }
  }

  getShifts(employeeId: number) {
    this.dataService.getShifts().subscribe(shifts => {
      this.turnos.set(shifts);
    });
  }

  turnosDaCelula(dia: string, periodo: string) {
    return this.turnos().filter(t => t.day === dia && t.shift === periodo);
  }
}
