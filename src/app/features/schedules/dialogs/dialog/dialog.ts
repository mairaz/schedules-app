import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockData } from '../../../../data/mock-data';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Employee, User } from '../../../../core/models';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DayOfWeek, ShiftPeriod } from '../../../../core/models/availability';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'dialog',
  imports: [JsonPipe, MatDialogTitle, MatDialogContent, MatSelectModule, MatFormFieldModule, MatCardModule, FormsModule, MatButtonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  data = inject<{ day: DayOfWeek; shift: ShiftPeriod }>(MAT_DIALOG_DATA);
  dataService = inject(MockData)
  dialogRef = inject(MatDialogRef<Dialog>);
  employeesAlreadyScheduled = computed(() => {
    return new Set(this.dataService.shifts().filter((shift) => {
      return (this.data.shift === shift.shift && this.data.day === shift.day)
    }).map(item => {
      return item.employeeId
    }));
  }
  )
  employees = computed(() => {
    const employees = this.dataService
      .employees()
      .filter((emp) =>
        !emp.availability[this.data.day].unavailable
        && emp.availability[this.data.day][this.data.shift]
      )
    return employees;
  });
  selectedEmployee = signal<Employee | undefined>(undefined);
  addUserShift() {
    const employee = this.selectedEmployee()
    if (!employee) return
    this.dataService.addShifts({
      employeeId: employee.id,
      name: employee.name,
      ...this.data,
    }).subscribe(
      res => {
        this.dialogRef.close(true);
      },
      error => {
        console.error('Erro ao adicionar shifts:', error);
      }
    );
  }

}
