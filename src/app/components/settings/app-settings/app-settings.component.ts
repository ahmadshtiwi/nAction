import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../authorization/login/login.service';

@Component({
  selector: 'app-app-settings',
  imports: [RouterModule],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.scss'
})
export class AppSettingsComponent {

    private LoginService = inject(LoginService);

  settings = [
    {
      routerLink : '/pages/roles',
      name : 'Roles',
      viewSetting : this.LoginService.getUser().flags.roles.CanViewRoles
    },
    {
      routerLink : '/pages/user-calendar',
      name : 'Paramters',
      viewSetting : this.LoginService.getUser().flags.calendar.CanManageAppCalendar
    },
  ]
}
