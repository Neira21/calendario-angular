import { Component, ViewChild } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivityFormComponent } from './components/activity-form/activity-form';
import { CalendarComponent } from './components/calendar/calendar';
import { Activity } from './models/activity.model';
import { ActivityService } from './services/activity.service';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    MatSnackBarModule,
    ActivityFormComponent,
    CalendarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Angular Calendar - Agenda de Actividades';
  selectedActivity?: Activity;
  selectedTabIndex = 1; // Start with calendar view

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  constructor(private snackBar: MatSnackBar, private activityService: ActivityService) {}

  onActivitySaved(activity: Activity) {
    this.snackBar.open('Actividad guardada exitosamente', 'Cerrar', {
      duration: 3000,
    });
    this.selectedActivity = undefined;
    this.selectedTabIndex = 1; // Switch to calendar view

    // Refresh calendar after a short delay
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.refreshCalendar();
      }
    }, 500);
  }

  onActivitySelected(activity: Activity) {
    this.selectedActivity = { ...activity }; // Create a copy
    this.selectedTabIndex = 0; // Switch to form view
  }

  onDateSelected(date: Date) {
    this.selectedActivity = {
      title: '',
      date: date.toISOString(),
    };
    this.selectedTabIndex = 0; // Switch to form view
  }

  onFormCancelled() {
    this.selectedActivity = undefined;
    this.selectedTabIndex = 1; // Switch to calendar view
  }

  onDeleteActivity(activity: Activity) {
    if (activity.id && confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      this.activityService.deleteActivity(activity.id).subscribe({
        next: () => {
          this.snackBar.open('Actividad eliminada exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.selectedActivity = undefined;
          this.calendarComponent.refreshCalendar();
        },
        error: (error) => {
          console.error('Error deleting activity:', error);
          this.snackBar.open('Error al eliminar la actividad', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }
}
