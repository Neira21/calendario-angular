import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent implements OnInit {
  @Output() activitySelected = new EventEmitter<Activity>();
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate = new Date();
  activities: Activity[] = [];
  calendarDays: any[] = [];
  monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.generateCalendar();
    this.loadActivities();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    const currentDay = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dayInfo = {
          date: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === month,
          isToday: this.isSameDay(currentDay, new Date()),
          activities: [] as Activity[]
        };
        weekDays.push(dayInfo);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      this.calendarDays.push(weekDays);
    }
  }

  loadActivities() {
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    this.activityService.getActivities(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    ).subscribe({
      next: (activities) => {
        this.activities = activities;
        this.assignActivitiesToDays();
      },
      error: (error) => console.error('Error loading activities:', error)
    });
  }

  assignActivitiesToDays() {
    // Clear previous activities
    this.calendarDays.forEach(week => {
      week.forEach((day: any) => {
        day.activities = [];
      });
    });

    // Assign activities to days
    this.activities.forEach(activity => {
      const activityDate = new Date(activity.date);
      this.calendarDays.forEach(week => {
        week.forEach((day: any) => {
          if (this.isSameDay(day.date, activityDate)) {
            day.activities.push(activity);
          }
        });
      });
    });
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
    this.loadActivities();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
    this.loadActivities();
  }

  onDayClick(day: any) {
    this.dateSelected.emit(day.date);
  }

  onActivityClick(event: Event, activity: Activity) {
    event.stopPropagation();
    this.activitySelected.emit(activity);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  refreshCalendar() {
    this.loadActivities();
  }

  trackByActivityId(index: number, activity: Activity): number {
    return activity.id || index;
  }
}
