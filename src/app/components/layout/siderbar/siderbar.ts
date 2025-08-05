import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessToken, Password } from '../../auth/login/login.model';
import { LoginService } from '../../auth/login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-siderbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.scss'
})
export class Siderbar {
  @Output() collapse = new EventEmitter();
collapseSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
  this.collapse.emit();
}

    private LoginService = inject(LoginService);

    user : AccessToken = this.LoginService.getUser();
    password: Password = new Password();
    isAdmin: boolean;
    showConfirmationError: boolean;
    isSidebarOpen: boolean=true;

  menuItems = [
    { name: 'Dashboard', icon: 'fa-solid fa-chart-line fa-10x', route: '/pages/dashboard', viewSection: this.user.flags.dashboard.CanViewDashboard },
    { name: 'Hourly Breakdown', icon: 'fa-solid fa-clock-rotate-left', route: '/pages/hourly-breakdown', viewSection: this.user.flags.tasks.CanViewEmployeeDailyWork },
    { name: 'My Tasks', icon: 'fa-solid fa-list', route: '/pages/tasks', viewSection: true },
    { name: 'Task Schedule', icon: 'bi bi-calendar-check', route: '/pages/tasks-schedule', viewSection: this.user.flags.reports.CanViewTaskSchedule },
    { name: 'Assigned Tasks', icon: 'fa-solid fa-list-check', route: '/pages/assigned-tasks', viewSection: this.user.flags.tasks.CanViewActiveTasks },
    { name: 'Performance', icon:'fa-solid fa-gauge-high', route: '/pages/performance', viewSection: this.user.flags.reports.CanViewEmployeePerformanceReport },
    { name: 'Allocation', icon: 'bi bi-pin-map-fill', route: '/pages/allocation', viewSection: this.user.flags.allocation.CanViewAllocation },
    { name: 'Top 10', icon: 'fa-solid fa-trophy', route: '/pages/top_ten', viewSection: this.user.flags.reports.CanViewTopTenReport },
    { name: 'Project Cost', icon: 'fa-solid fa-coins', route: '/pages/project-costs', viewSection: this.user.flags.reports.CanViewProjectCostsReport },
    { name: 'Resources', icon: 'fa-solid fa-user-group', route: '/pages/resource', viewSection: this.user.flags.users.CanAddUser },
    { name: 'Projects', icon: 'fa-solid fa-diagram-project', route: '/pages/projects', viewSection: this.user.flags.projects.CanViewProjects },
    { name: 'Settings', icon: 'fa-solid fa-gear', route: '/pages/settings', viewSection: (this.user.flags.calendar.CanManageAppCalendar || this.user.flags.roles.CanViewRoles) },

  ];

    clearSession() :void
  {
    sessionStorage.clear();
  }

    toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
