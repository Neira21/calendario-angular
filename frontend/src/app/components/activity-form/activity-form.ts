import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Activity, CreateActivityDto } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
  ],
  templateUrl: './activity-form.html',
  styleUrl: './activity-form.scss',
})
export class ActivityFormComponent implements OnInit {
  @Input() activity?: Activity;
  @Output() activitySaved = new EventEmitter<Activity>();
  @Output() cancelled = new EventEmitter<void>();

  activityForm: FormGroup;
  isLoading = false;

  // Inject services
  private readonly formBuilder = inject(FormBuilder);
  private readonly activityService = inject(ActivityService);

  constructor() {
    this.activityForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      date: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.activity) {
      this.activityForm.patchValue({
        title: this.activity.title,
        description: this.activity.description,
        date: new Date(this.activity.date),
      });
    }
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this.isLoading = true;
      const formValue = this.activityForm.value;

      const activityData: CreateActivityDto = {
        title: formValue.title,
        description: formValue.description,
        date: formValue.date.toISOString(),
      };

      const request = this.activity
        ? this.activityService.updateActivity(this.activity.id!, activityData)
        : this.activityService.createActivity(activityData);

      request.subscribe({
        next: (savedActivity) => {
          this.isLoading = false;
          this.activitySaved.emit(savedActivity);
          this.activityForm.reset();
        },
        error: (error) => {
          console.error('Error saving activity:', error);
          this.isLoading = false;
        },
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
    this.activityForm.reset();
  }

  get title() {
    return this.activityForm.get('title');
  }
  get description() {
    return this.activityForm.get('description');
  }
  get date() {
    return this.activityForm.get('date');
  }
}
