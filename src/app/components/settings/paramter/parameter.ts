import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { SettingsService } from '../settings.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { Parameters } from './parameter.model';
import { forkJoin } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserCalendar } from '../calendar/calendar.model';

@Component({
  selector: 'app-paramter',
  imports: [CommonModule, FormsModule, NgSelectModule, RouterModule],
  templateUrl: './parameter.html',
  styleUrl: './parameter.scss'
})
export class Paramter implements OnInit {
  parameters: Parameters = new Parameters();
  projects: { id: number, name: string, imageURL: string }[] = [];
  users: { id: string; fullName: string; }[];
  selectedProjectId: number;


  constructor(private settingService: SettingsService, private route: ActivatedRoute,
    private spinnerService: SpinnerService, private lookupService: LookUpsService) { }

  ngOnInit(): void {
    this.getLookups();
    this.getBacklogDays();
  }

  getLookups() {

    this.spinnerService.show();
    this.lookupService.getAllProjects().subscribe(res => {

      if (res) {
        this.projects = res;
        this.spinnerService.hide();
      }
    });
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
      this.selectedProjectId = parseInt(this.parameters.parameters.InactiveTaskProject);  // تحويل string إلى number
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
}