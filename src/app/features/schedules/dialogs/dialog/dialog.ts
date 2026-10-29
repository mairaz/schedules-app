import { Component, inject, signal } from '@angular/core';
import { MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockData } from '../../../../data/mock-data';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../../core/models';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'dialog',
  imports: [MatDialogTitle, MatDialogContent, MatSelectModule, MatFormFieldModule, MatCardModule, FormsModule, MatButtonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  data = inject(MAT_DIALOG_DATA);
  dataService = inject(MockData)
  dialogRef = inject(MatDialogRef<Dialog>);
  users = inject(MockData).users();
  selectedUser = signal<User | undefined>(undefined);

  addUserShift() {
    if (!this.selectedUser()) return
    this.dataService.addShifts({
      employeeId: this.selectedUser()?.id,
      name: this.selectedUser()?.name,
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
