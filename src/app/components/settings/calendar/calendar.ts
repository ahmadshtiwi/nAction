import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { forkJoin } from 'rxjs';
import { Parameters } from '../paramter/parameter.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserCalendar } from './calendar.model';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})

export class CalendarComponent implements OnInit {

  tableHeader: String[] = ['Day', 'Working Hours', 'Description', 'From Time', 'To Time'];
  weekSchedule: UserCalendar[] = [];
  startDate: string;
  descriptions: { description: string; id: number; }[] = [];
  availableHours = [
    { label: "0", value: "00:00:00" },
    { label: "30 Min", value: "00:30:00" },
    { label: "1 Hour", value: "01:00:00" },
    { label: "1 Hour 30 Min", value: "01:30:00" },
    { label: "2 Hour", value: "02:00:00" },
    { label: "2 Hour 30 Min", value: "02:30:00" },
    { label: "3 Hour", value: "03:00:00" },
    { label: "3 Hour 30 Min", value: "03:30:00" },
    { label: "4 Hour", value: "04:00:00" },
    { label: "4 Hour 30 Min", value: "04:30:00" },
    { label: "5 Hour", value: "05:00:00" },
    { label: "5 Hour 30 Min", value: "05:30:00" },
    { label: "6 Hour", value: "06:00:00" },
    { label: "6 Hour 30 Min", value: "06:30:00" },
    { label: "7 Hour", value: "07:00:00" },
    { label: "7 Hour 30 Min", value: "07:30:00" },
    { label: "8 Hour", value: "08:00:00" },
    { label: "8 Hour 30 Min", value: "08:30:00" },
    { label: "9 Hour", value: "09:00:00" },
    { label: "9 Hour 30 Min", value: "09:30:00" },
    { label: "10 Hours", value: "10:00:00" },
    { label: "10 Hours 30 Min", value: "10:30:00" },
    { label: "11 Hours", value: "11:00:00" },
    { label: "11 Hours 30 Min", value: "11:30:00" },
    { label: "12 Hours", value: "12:00:00" },
    { label: "12 Hours 30 Min", value: "12:30:00" },
    { label: "13 Hours", value: "13:00:00" },
    { label: "13 Hours 30 Min", value: "13:30:00" },
    { label: "14 Hours", value: "14:00:00" },
    { label: "14 Hours 30 Min", value: "14:30:00" },
    { label: "15 Hours", value: "15:00:00" },
    { label: "15 Hours 30 Min", value: "15:30:00" },
    { label: "16 Hours", value: "16:00:00" }
  ];

  constructor(private settingService: SettingsService, private route: ActivatedRoute,
    private spinnerService: SpinnerService, private lookupService: LookUpsService) { }

  ngOnInit(): void {
    this.getUserCalendar();
  }

  
  getUserCalendar() {
    this.spinnerService.show();
    this.settingService.calendar().subscribe(res => {
      if (res) {
        this.weekSchedule = res;
        this.settingService.getCalendarLookups().subscribe(res => {
          this.descriptions = res;
        })
        this.spinnerService.hide();
      }
    })
  }

  submitForm() {
      this.settingService.calendarUpdate(this.weekSchedule).subscribe(res => {
        if (res) {
          this.getUserCalendar()
        }
      })
    
  }
}