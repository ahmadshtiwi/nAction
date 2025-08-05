import { Component, inject, Inject, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../authorization/login/login.service';
import { NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { Password } from './passwords.model';
import { CommonModule } from '@angular/common';
import { AccessToken } from '../authorization/models/access-token';
import { SignalRService } from '../../shared/services/signalR.service';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, NgbModule, FormsModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  private LoginService = inject(LoginService);

  password: Password = new Password();
  user : AccessToken = this.LoginService.getUser();
  isAdmin: boolean;
  showConfirmationError: boolean;
  isSidebarOpen: boolean;
  menuItems = [
    { name: 'Hourly Breakdown', icon: 'bi-card-text', route: '/pages/log', viewSection: this.user.flags.tasks.CanViewEmployeeDailyWork },
    { name: 'My Tasks', icon: 'bi-list-task', route: '/pages/tasks', viewSection: true },
    { name: 'Assigned Tasks', icon: 'bi-card-text', route: '/pages/open-tasks', viewSection: this.user.flags.tasks.CanViewActiveTasks },
    { name: 'Performance', icon: 'bi-card-text', route: '/pages/user-reports', viewSection: this.user.flags.reports.CanViewEmployeePerformanceReport },
    { name: 'Top 10', icon: 'bi bi-trophy', route: '/pages/top_ten', viewSection: this.user.flags.reports.CanViewTopTenReport },
    { name: 'Project Cost', icon: 'bi-card-text', route: '/pages/project-costs', viewSection: this.user.flags.reports.CanViewProjectCostsReport },
    { name: 'Resources', icon: 'bi-person', route: '/pages/users', viewSection: this.user.flags.users.CanAddUser },
    { name: 'Projects', icon: 'bi-tools', route: '/pages/projects', viewSection: this.user.flags.projects.CanViewProjects },
    { name: 'App Settings', icon: 'bi-gear', route: '/pages/app-settings', viewSection: (this.user.flags.calendar.CanManageAppCalendar || this.user.flags.roles.CanViewRoles) },

  ];

  constructor(public loginService: LoginService, private router: Router, private offcanvasService: NgbOffcanvas , private signleRservice:SignalRService) {
  }

  ngOnInit(): void {
    this.isAdmin = this.loginService.getUser().IsAdmin == 'True' ? true : false;
    this.signleRservice.subscribeToUser(this.loginService.getUser().sub);

  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest(form: NgForm) {
    if (form.invalid || this.showConfirmationError) {
      return
    }
    this.loginService.changePassword(this.password).subscribe(res => {
      if (res) {
        this.offcanvasService.dismiss();
      }
    })
  }

  checkConfirmPassword() {
    if (this.password.confirmPassword != this.password.newPassword) {
      this.showConfirmationError = true;
    } else {
      this.showConfirmationError = false;
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'])
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
