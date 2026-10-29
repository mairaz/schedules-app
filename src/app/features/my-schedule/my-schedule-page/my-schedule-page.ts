import { Component, inject, signal } from '@angular/core';
import { MockData } from '../../../data/mock-data';
import { Auth } from '../../../core/auth';
import { DAYS_OF_WEEK, SHIFTS } from '../../../core/models/availability';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../schedules/dialogs/dialog/dialog';
import { NgClass } from '@angular/common';
import { ShiftSchedule } from '../../../core/models/shiftSchedule';

@Component({
  selector: 'app-my-schedule-page',
  imports: [MatButtonModule, NgClass],
  templateUrl: './my-schedule-page.html',
  styleUrl: './my-schedule-page.scss',
})
export class MySchedulePage {
  dataService = inject(MockData);
  currentUser = signal(inject(Auth).currentUser());
  dialog = inject(MatDialog);

  days = DAYS_OF_WEEK;
  shifts = SHIFTS;
  turnos = signal<ShiftSchedule[]>([]);

  ngOnInit() {
    const user = this.currentUser();
    if (user) {
      this.getShifts();
    }
  }

  getShifts() {
    this.dataService.getShifts().subscribe(shifts => {
      this.turnos.set(shifts);
    });
  }

  turnosDaCelula(dia: string, periodo: string) {
    return this.turnos().filter(t => t.day === dia && t.shift === periodo);
  }

  openDialog(data: any) {
    this.dialog.open(Dialog, {
      data
    }).afterClosed().subscribe(res => {
      if (res) {
        const userId = this.currentUser()?.id;
        if (userId) {
          this.getShifts();


        }
      }
    })
  }
}
