import { Component, inject, ViewChild } from '@angular/core';
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
  selectedActivity?: Activity; // Actividad seleccionada en caso para editar
  // Start with ActivityFormComponent
  selectedTabIndex = 1; //(0-> Form | 1-> Calendar)

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  private snackBar = inject(MatSnackBar);
  private activityService = inject(ActivityService);

  onActivitySaved(activity: Activity) {
    // Guardar la actividad y mostrar notificación,
    this.snackBar.open(`Actividad guardada exitosamente: ${activity.title}`, 'Cerrar', {
      duration: 3000,
    });
    this.selectedActivity = undefined;
    this.selectedTabIndex = 1; // Cambia a Vista de Calendario al guardar

    // Esto refresca el calendario después de un pequeño retraso para asegurar que la actividad sea visible en el calendario
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.refreshCalendar();
      }
    }, 500);
  }

  // Método para obtener la actividad y tenerlo en app.component.ts
  onActivitySelected(activity: Activity) {
    this.selectedActivity = { ...activity }; // Crea una copia en selected Activity
    this.selectedTabIndex = 0; // Cambia a formulario para editar
  }

  // Método para manejar la selección de una fecha en el calendario
  onDateSelected(date: Date) {
    this.selectedActivity = {
      title: '',
      date: date.toISOString(),
    };
    this.selectedTabIndex = 0; // Cambia a formulario para crear
  }

  // Cancela el formulario y reedirige al calendario
  onFormCancelled() {
    this.selectedActivity = undefined;
    this.selectedTabIndex = 1; // Cambia a Vista de Calendario
  }

  // Borrar la actividad
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
