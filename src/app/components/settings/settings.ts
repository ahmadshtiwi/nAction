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
      icon:'fa-solid fa-universal-access fa-3x'
    },
    {
      routerLink : '/pages/paramter',
      name : 'Paramters',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-globe fa-3x'
    },
     {
      routerLink : '/pages/email',
      name : 'Email',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-envelope fa-3x'
    },
    {
     routerLink : '/pages/calendar',
     name : 'Calendar',
     viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
     icon:'fa-solid fa-calendar fa-3x'
   },
     {
      routerLink : '/pages/user-calendar',
      name : 'User Calendar',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-calendar-days fa-3x'
    },
     {
      routerLink : '/pages/work_day_type',
      name : 'Work Day Type	',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar,
      icon:'fa-solid fa-font-awesome fa-3x'

    },
  ]
}
