import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { UserCalendar } from '../calendar/calendar.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-user-calendar',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './user-calendar.html',
  styleUrl: './user-calendar.scss'
})
export class UserCalendarComponent implements OnInit {

  tableHeaders: string[] = ['Date', 'Day', 'Working', 'Description'];
  weekSchedule: UserCalendar[] = [];
  userId: string;
  startDate: string;
  userName: string;
  descriptions: { description: string; id: number; }[] = [];
  availableHours = [
    { label: "0", value: "00:00:00" },
    { label: "30 minutes", value: "00:30:00" },
    { label: "1 hour", value: "01:00:00" },
    { label: "1 hour 30 minutes", value: "01:30:00" },
    { label: "2 hours", value: "02:00:00" },
    { label: "2 hours 30 minutes", value: "02:30:00" },
    { label: "3 hours", value: "03:00:00" },
    { label: "3 hours 30 minutes", value: "03:30:00" },
    { label: "4 hours", value: "04:00:00" },
    { label: "4 hours 30 minutes", value: "04:30:00" },
    { label: "5 hours", value: "05:00:00" },
    { label: "5 hours 30 minutes", value: "05:30:00" },
    { label: "6 hours", value: "06:00:00" },
    { label: "6 hours 30 minutes", value: "06:30:00" },
    { label: "7 hours", value: "07:00:00" },
    { label: "7 hours 30 minutes", value: "07:30:00" },
    { label: "8 hours", value: "08:00:00" },
    { label: "8 hours 30 minutes", value: "08:30:00" },
    { label: "9 hours", value: "09:00:00" },
    { label: "9 hours 30 minutes", value: "09:30:00" },
    { label: "10 hours", value: "10:00:00" },
    { label: "10 hours 30 minutes", value: "10:30:00" },
    { label: "11 hours", value: "11:00:00" },
    { label: "11 hours 30 minutes", value: "11:30:00" },
    { label: "12 hours", value: "12:00:00" },
    { label: "12 hours 30 minutes", value: "12:30:00" },
    { label: "13 hours", value: "13:00:00" },
    { label: "13 hours 30 minutes", value: "13:30:00" },
    { label: "14 hours", value: "14:00:00" },
    { label: "14 hours 30 minutes", value: "14:30:00" },
    { label: "15 hours", value: "15:00:00" },
    { label: "15 hours 30 minutes", value: "15:30:00" },
    { label: "16 hours", value: "16:00:00" }
  ];
  users: { id: string; fullName: string; }[];



  constructor(private settingService: SettingsService, private route: ActivatedRoute, private spinnerService: SpinnerService, private lookupService: LookUpsService) { }

  ngOnInit(): void {
    this.getLookups();
    const today = new Date();
    this.startDate = this.formatDate(today);

    if (this.userId) {
      this.getUserWeek();
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  }
  getLookups() {
    this.lookupService.getAllUser().subscribe(res => {
      if (res) {
        this.users = res;
      }

    });
  }

  getUserWeek(startDate?: string) {
    if (this.userId) {

      // this.startDate = startDate;
      this.spinnerService.show();
      this.settingService.userWeek(this.userId, this.startDate).subscribe(res => {
        if (res) {
          debugger
          this.weekSchedule = res;
          this.settingService.getCalendarLookups().subscribe(res => {
            this.descriptions = res;
            this.spinnerService.hide();
          })
        }
      })
    }
  }

  getUserCalendar() {
    this.settingService.calendar().subscribe(res => {
      if (res) {
        this.weekSchedule = res;

        this.settingService.getCalendarLookups().subscribe(res => {
          this.descriptions = res;
        })
      }
    })
  }
  submitForm() {
    this.spinnerService.show();

    this.settingService.updateUserWeek(this.weekSchedule, this.userId).subscribe(res => {
      if (res) {
        this.getUserWeek(this.startDate)
        this.spinnerService.hide();
      }
    })

    setTimeout(() => {
      this.spinnerService.hide();
    }, 3000); // 3 seconds delay
  }
}