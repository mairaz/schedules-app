import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockData } from '../../../data/mock-data';
import { DayOfWeek, DAYS_OF_WEEK, SHIFTS } from '../../../core/models/availability';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dataService = inject(MockData);

  form!: FormGroup;
  employeeId: number | null = null;
  isEditMode = false;
  PositionOptions = ['Manager', 'Bartender', 'Server', 'Cook'];
  daysOfWeek = DAYS_OF_WEEK;
  shifts = SHIFTS;
  expandedDay: DayOfWeek | null = null;
  private periodosGroup() {
    return this.fb.nonNullable.group({ "morning": false, "afternoon": false, "evening": false, "night": false, "unavailable": false });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
    this.isEditMode = !!this.employeeId;
    this.form = this.fb.nonNullable.group({
      name: [''],
      email: [''],
      position: [''],
      availability: this.fb.nonNullable.group({
        monday: this.periodosGroup(),
        tuesday: this.periodosGroup(),
        wednesday: this.periodosGroup(),
        thursday: this.periodosGroup(),
        friday: this.periodosGroup(),
        saturday: this.periodosGroup(),
        sunday: this.periodosGroup()
      })
    });

    if (this.isEditMode) {
      this.dataService.getEmployeeById(this.employeeId!).subscribe(employee => {
        this.form.patchValue({
          name: employee.name,
          email: employee.email,
          position: employee.position,
          availability: employee.availability
        });
      });
    }
  }


  onCancel() {
    this.router.navigate(['/home/employees']);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const employeeData = this.form.value;

    if (this.isEditMode && this.employeeId !== null) {
      this.dataService.updateEmployee(this.employeeId, employeeData).subscribe({
        next: () => {
          console.log('Employee updated successfully');
          this.router.navigate(['/home/employees']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
        }
      });
    } else {
      this.dataService.createEmployee({ ...employeeData, role: 'employee' }).subscribe({
        next: () => {
          console.log('Employee created successfully');
          this.router.navigate(['/home/employees']);
        },
        error: (err) => {
          console.error('Error creating employee:', err);
        }
      });
    }
  }
}
