import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackLogDays, Parameters, UserCalendar } from './user-calendar.model';
import { SettingsService } from '../settings.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-calendar',
  imports: [CommonModule, FormsModule , NgSelectModule ,RouterModule],
  templateUrl: './user-calendar.component.html',
  styleUrl: './user-calendar.component.scss'
})
export class UserCalendarComponent implements OnInit {
  weekSchedule: UserCalendar[] = [];
  parameters:Parameters= new Parameters();
  userId: string;
  showDate: boolean;
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
  projects: {id : number , name : string , imageURL : string}[] = [];
  users: { id: string; fullName: string; }[];
  hours: number = 0;
  minutes: number = 0;
 selectedProjectId :number;
  

  constructor(private settingService: SettingsService, private route: ActivatedRoute, private spinnerService: SpinnerService, private lookupService : LookUpsService) { }

  ngOnInit(): void {
    this.getLookups();
    if (this.route.snapshot.paramMap.get('id') && this.route.snapshot.paramMap.get('name')) {
      this.userId = this.route.snapshot.paramMap.get('id');
      this.userName = this.route.snapshot.paramMap.get('name');
      this.getUserWeek();
      this.showDate = true;
    } else {
      this.getBacklogDays();
      this.getUserCalendar();
    }

  }

  getLookups() {
    forkJoin({
      projects: this.lookupService.getAllProjects(),
      users: this.lookupService.getAllUser(),
    }).subscribe({
      next: ({ projects, users }) => {
        if (projects) {
          this.projects = projects;
        }
        if (users) {
          this.users = users;
        }
      },
      error: (err) => {
        console.error('Error occurred while fetching data:', err);
        // Handle error scenarios
      },
    });
  }

  getUserWeek(startDate?: string) {
    this.startDate = startDate;
    this.settingService.userWeek(this.userId, this.startDate).subscribe(res => {
      if (res) {
        this.weekSchedule = res;
        
        this.settingService.getCalendarLookups().subscribe(res=>{
          this.descriptions = res;
        })
      }
    })
  }

  getUserCalendar() {
    this.settingService.calendar().subscribe(res => {
      if (res) {
        this.weekSchedule = res;
        
            this.settingService.getCalendarLookups().subscribe(res=>{
              this.descriptions = res;
            })
      }
    })
  }



 

  getBacklogDays() {
    this.settingService.getBacklogDays().subscribe((res) => {
      if (res) {
        this.parameters = res;
        this.setInactiveTaskProjectName();
        if (this.parameters.parameters?.InactiveTaskDuration) {
          const [hh, mm] = this.parameters.parameters.InactiveTaskDuration.split(':').map(Number);
          this.parameters.parameters.TaskDurationHours = hh || 0;
          this.parameters.parameters.TaskDurationMinutes = mm || 0;
        }
      }
    });
  }
  setInactiveTaskProjectName() {
    if (this.parameters.parameters?.InactiveTaskProject) {
      this.selectedProjectId = parseInt(this.parameters.parameters.InactiveTaskProject, 10);  // تحويل string إلى number
    }
  }
  
  
  checkTimeFormat() {
    let hour = this.parameters.parameters.TaskDurationHours < 10 ? `0${this.parameters.parameters.TaskDurationHours}` : `${this.parameters.parameters.TaskDurationHours}`;
    let minute = this.parameters.parameters.TaskDurationMinutes < 10 ? `0${this.parameters.parameters.TaskDurationMinutes}` : `${this.parameters.parameters.TaskDurationMinutes}`;
    
    this.parameters.parameters.InactiveTaskDuration = `${hour}:${minute}`;
  }
  
  
  submitBackLogDay() {
    this.parameters.parameters.InactiveTaskProject = this.selectedProjectId ? this.selectedProjectId.toString() : null;

    this.checkTimeFormat(); 
    this.parameters.parameters.Backlog_Days = String(this.parameters.parameters.Backlog_Days);
    this.parameters.parameters.Reject_Prefix = String(this.parameters.parameters.Reject_Prefix);
    this.parameters.parameters.InactiveTaskProject = String(this.parameters.parameters.InactiveTaskProject);
    this.parameters.parameters.InactiveTaskTitle = String(this.parameters.parameters.InactiveTaskTitle);
    this.parameters.parameters.InactiveTaskResource = String(this.parameters.parameters.InactiveTaskResource);
    this.parameters.parameters.InactiveTaskDesc = String(this.parameters.parameters.InactiveTaskDesc);
    this.parameters.parameters.InactiveTaskDuration = String(this.parameters.parameters.InactiveTaskDuration);
  
    this.spinnerService.show();
  
    this.settingService.updateBackLogDay(this.convertToNewFormat()).subscribe(res => {
      if (res) {
        this.spinnerService.hide();
        
        this.getBacklogDays();
      }
    });
  }
  
  

  convertToNewFormat(): any {
    const { TaskDurationHours = 0, TaskDurationMinutes = 0, ...otherParams } = this.parameters.parameters;
    const formattedDuration = this.formatTaskDuration(TaskDurationHours, TaskDurationMinutes);
    
    // لا تقم بإضافة InactiveTaskDuration مرة أخرى هنا
    const parameters = Object.entries(otherParams).map(([key, value]) => ({
      paramName: key,
      paramValue: value ?? '' // تأكد من تحويل القيم إلى نص
    }));
  
    // إضافة `InactiveTaskDuration` إذا لم تكن موجودة
    parameters.push({ paramName: 'InactiveTaskDuration', paramValue: formattedDuration });
  
    return { parameters };
  }
غ  
  
  
  
  formatTaskDuration(hours: number, minutes: number): string {
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  

checkHours(event: any) {
  let value = event.target.value;
  if (value < 0) {
    this.parameters.parameters.TaskDurationHours = 0;
  } 
  else if (value > 23) {
    this.parameters.parameters.TaskDurationHours = 23;
  } 
  else {
    this.parameters.parameters.TaskDurationHours = value;
  }
}

checkMinutes(event: any) {
  let value = event.target.value;
  if (value < 0) {
    this.parameters.parameters.TaskDurationMinutes = 0;
  } 
  else if (value > 59) {
    this.parameters.parameters.TaskDurationMinutes = 59;
  } 
  else {
    this.parameters.parameters.TaskDurationMinutes = value;
  }
}


  submitForm() {
    this.spinnerService.show();
    if (!this.userId) {
      this.settingService.calendarUpdate(this.weekSchedule).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.getUserCalendar()
        }
      })
    } else {
      if (this.route.snapshot.paramMap.get('id')) {
        this.userId = this.route.snapshot.paramMap.get('id');
      } else {
        this.userId = null;
      }
      this.settingService.updateUserWeek(this.weekSchedule, this.userId).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.getUserWeek(this.startDate)
        }
      })
    }
  }
}