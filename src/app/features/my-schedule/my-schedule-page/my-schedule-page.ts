import { Component, computed, inject, signal } from '@angular/core';
import { MockData } from '../../../data/mock-data';
import { Auth } from '../../../core/auth';
import { DAYS_OF_WEEK, DayOfWeek, SHIFTS, ShiftPeriod } from '../../../core/models/availability';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../../schedules/dialogs/dialog/dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-my-schedule-page',
  imports: [MatButtonModule, NgClass],
  templateUrl: './my-schedule-page.html',
  styleUrl: './my-schedule-page.scss',
})
export class MySchedulePage {
  dataService = inject(MockData);
  currentUser = signal(inject(Auth).currentUser());
  currentEmployee = this.dataService.currentEmployee;
  dialog = inject(MatDialog);

  days = DAYS_OF_WEEK;
  shifts = SHIFTS;
  employeeNameById = computed(() => new Map(this.dataService.employees().map((employee) => [employee.id, employee.name])));

  ngOnInit() {
    this.dataService.getShifts().subscribe();
  }

  turnosDaCelula(dia: string, periodo: string) {
    return this.dataService.shifts().filter(t => t.day === dia && t.shift === periodo);
  }

  openDialog(data: { day: DayOfWeek; shift: ShiftPeriod }) {
    this.dialog.open(Dialog, { data });
  }
}
