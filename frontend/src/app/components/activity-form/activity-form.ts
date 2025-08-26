import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
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
export class ActivityFormComponent implements OnInit, OnChanges {
  // La actividad que viene de app.component.ts para editar
  @Input() activity?: Activity;

  // Evento para indicar que se guardó una actividad
  @Output() activitySaved = new EventEmitter<Activity>();

  // Evento para indicar que se canceló la acción
  @Output() cancelled = new EventEmitter<void>();

  isLoading = false;

  // Inject services
  private readonly formBuilder = inject(FormBuilder);
  private readonly activityService = inject(ActivityService);

  activityForm!: FormGroup;

  ngOnInit() {
    this.activityForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      date: ['', Validators.required],
    });

    this.loadActivityData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activity'] && this.activityForm) {
      this.loadActivityData();
    }
  }

  private loadActivityData() {
    if (this.activity && this.activity.id) {
      // Solo si tiene ID es una actividad completa para editar
      console.log('Loading activity data for editing:', this.activity);
      this.activityForm.patchValue({
        title: this.activity.title,
        description: this.activity.description || '',
        // convertir string a Date
        date: new Date(this.activity.date),
      });
    } else if (this.activity && !this.activity.id) {
      // Si no tiene ID pero tiene fecha, es una nueva actividad con fecha preseleccionada
      console.log('Creating new activity with preselected date:', this.activity.date);
      this.activityForm.patchValue({
        title: '',
        description: '',
        date: new Date(this.activity.date),
      });
    } else {
      // Si no hay actividad, resetear el formulario completamente
      this.resetForm();
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

      // Si hay una actividad CON ID, es una actualización; de lo contrario, es una creación
      const request =
        this.activity && this.activity.id
          ? this.activityService.updateActivity(this.activity.id, activityData)
          : this.activityService.createActivity(activityData);

      //Suscripción a la respuesta del servicio
      request.subscribe({
        next: (savedActivity) => {
          this.isLoading = false;
          this.activitySaved.emit(savedActivity);
          this.resetForm();
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
    this.resetForm();
  }

  private resetForm() {
    this.activityForm.reset();
    // Resetear también el estado de validación para evitar que aparezcan errores
    this.activityForm.markAsUntouched();
    this.activityForm.markAsPristine();
    // Resetear cada control individualmente
    Object.keys(this.activityForm.controls).forEach((key) => {
      const control = this.activityForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
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
