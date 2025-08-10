import { Component, inject } from '@angular/core';
import { LoginService } from '../auth/login/login.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [RouterModule,CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
private LoginService = inject(LoginService);

  settings = [
    {
      routerLink : '/pages/roles',
      name : 'Roles',
      viewSetting : this.LoginService.getUser().flags.roles.CanViewRoles,
      icon:'fa-solid fa-universal-access fa-2x'
    },
    {
      routerLink : '/pages/paramter',
      name : 'Parameters',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-globe fa-2x'
    },
     {
      routerLink : '/pages/email',
      name : 'Email',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-envelope fa-2x'
    },
    {
     routerLink : '/pages/calendar',
     name : 'Calendar',
     viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
     icon:'fa-solid fa-calendar fa-2x'
   },
     {
      routerLink : '/pages/user-calendar',
      name : 'User Calendar',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-calendar-days fa-2x'
    },
     {
      routerLink : '/pages/work_day_type',
      name : 'Work Day Type',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-clock fa-2x'
    },
  ];

  getSettingDescription(settingName: string): string {
    const descriptions: { [key: string]: string } = {
      'Roles': 'Manage user roles and permissions',
      'Parameters': 'Configure system parameters and settings',
      'Email': 'Set up email notifications and templates',
      'Calendar': 'Manage application calendar settings',
      'User Calendar': 'Configure individual user calendars',
      'Work Day Type': 'Define work day types and schedules'
    };
    return descriptions[settingName] || 'Manage system configuration';
  }
}
