import { Routes } from "@angular/router";
import { ViewPermissionGuard } from "../shared/guard/permission.guard";


export const COMPONENTS_ROUTES: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadComponent: () => import('./auth/login/login')
      .then(m => m.Login)
  },
  // {
  //   path: "forget-password",
  //   loadComponent: () => import("./auth/forget-password/forget-password")
  //     .then(m => m.ForgetPasswordComponent)
  // },
  {
    path: "reset-password",
    loadComponent: () => import("./auth/reset-password/reset-password")
      .then(m => m.ResetPasswordComponent)
  },
  {
    path: "pages",
    loadComponent: () => import('./layout/layout')
      .then(m => m.Layout),
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('./task/task').then(m => m.Task),
        canActivate: [ViewPermissionGuard],
        data: { section: 'tasks', permissionKey: 'CanViewActiveTasks' }
      },
      {
        path: 'tasks-schedule',
        loadComponent: () => import('./task-schedule/task-schedule').then(m => m.TaskSchedule),
         canActivate: [ViewPermissionGuard],
         data: { section: 'reports', permissionKey: 'CanViewTaskSchedule' }
      },
      {
        path: 'tasks/:id',
        loadComponent: () => import('./worklog/worklog').then(m => m.Worklog)
      },
      {
        path: 'hourly-breakdown',
        loadComponent: () => import('./worklog/worklog').then(m => m.Worklog),
         canActivate: [ViewPermissionGuard],
         data: { section: 'tasks', permissionKey: 'CanViewEmployeeDailyWork' }
      },
      {
        path: 'log/:empId/:date',
        loadComponent: () => import('./worklog/worklog').then(m => m.Worklog),
         canActivate: [ViewPermissionGuard],
         data: { section: 'tasks', permissionKey: 'CanViewEmployeeDailyWork' }
       },
      {
        path: 'log/:empId/:taskName',
        loadComponent: () => import('./worklog/worklog').then(m => m.Worklog),
         canActivate: [ViewPermissionGuard],
         data: { section: 'tasks', permissionKey: 'CanViewEmployeeDailyWork' }
      },
      {
        path: 'log/:empId/:fromDate/:toDate/:projectId',
        loadComponent: () => import('./worklog/worklog').then(m => m.Worklog),
         canActivate: [ViewPermissionGuard],
         data: { section: 'tasks', permissionKey: 'CanViewEmployeeDailyWork' }
      },
      {
        path: 'projects',
        loadComponent: () => import('./project/project').then(m => m.ProjectComponent),
         canActivate: [ViewPermissionGuard],
         data: { section: 'projects', permissionKey: 'CanViewProjects' }
      },
      {
        path: 'project-resource/:projectId/:projectName',
        loadComponent: () => import('./project-resource/project-resource').then(m => m.ProjectResource)
      },
  

      {
        path: 'assigned-tasks',
        loadComponent: () => import('./assigned-tasks/assigned-tasks').then(m => m.AssignedTasks),
         canActivate: [ViewPermissionGuard],
        data: { section: 'tasks', permissionKey: 'CanViewEmployeeDailyWork' }
      },
      {
        path: 'performance',
        loadComponent: () => import('./performance/performance').then(m => m.Performance),
         canActivate: [ViewPermissionGuard],
         data: { section: 'reports', permissionKey: 'CanViewEmployeePerformanceReport' }
      },
      {
        path: 'project-costs',
        loadComponent: () => import('./project-cost/project-cost').then(m => m.ProjectCostComponent),
         canActivate: [ViewPermissionGuard],
         data: { section: 'reports', permissionKey: 'CanViewProjectCostsReport' }
      },
      {
        path: 'top_ten',
        loadComponent: () => import('./top-ten/top-ten').then(m => m.TopTen),
         canActivate: [ViewPermissionGuard],
         data: { section: 'reports', permissionKey: 'CanViewTopTenReport' }
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
         canActivate: [ViewPermissionGuard],
         data: { section: 'dashboard', permissionKey: 'CanViewDashboard' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then(m => m.Settings)
      },
      {
        path: 'roles',
        loadComponent: () => import('./settings/roles/roles').then(m => m.RolesComponent),
         canActivate: [ViewPermissionGuard],
         data: { section: 'roles', permissionKey: 'CanViewRoles' }
      },
      {
        path: 'paramter',
        loadComponent: () => import('./settings/paramter/parameter').then(m => m.Paramter),
         canActivate: [ViewPermissionGuard],
         data: { section: 'roles', permissionKey: 'CanViewRoles' }
      },
      {
        path: 'email',
        loadComponent: () => import('./settings/email/email').then(m =>m.Email)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./settings/calendar/calendar').then(m => m.CalendarComponent)
      },
      {
        path: 'user-calendar',
        loadComponent: () => import('./settings/user-calendar/user-calendar').then(m => m.UserCalendarComponent)
      },
      {
        path: 'hourly-cost/:id/:name',
        loadComponent: () => import('./hourly-cost/hourly-cost').then(m => m.HourlyCostComponent)
      },
      {
        path: 'resource-allocation/:id/:name',
        loadComponent: () => import('./settings/resource-allocation/resource-allocation').then(m => m.ResourceAllocationComponent)
      },
      {
        path: 'allocation',
        loadComponent: () => import('./allocation/allocation').then(m => m.Allocation)
      },

      {
        path: 'work_day_type',
        loadComponent: () => import('./settings/calendar-description/calendar-description').then(m => m.CalendarDescriptionComponent)
      },
      
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then(m => m.Profile)
      },
      

      {
        path: 'resource',
        loadComponent: () => import('./resource/resource').then(m => m.Resource),
         canActivate: [ViewPermissionGuard],
         data: { section: 'users', permissionKey: 'CanAddUser' },
        children: [
          {
            path: '',
            redirectTo: 'card',
            pathMatch: 'full'
          },
          {
            path: 'card',
            loadComponent: () => import('./resource/resource-card/resource-card').then(m => m.ResourceCard),
             canActivate: [ViewPermissionGuard],
             data: { section: 'users', permissionKey: 'CanAddUser' }
          },
          {
            path: 'table',
            loadComponent: () => import('./resource/resource-table/resource-table').then(m => m.ResourceTable),
             canActivate: [ViewPermissionGuard],
             data: { section: 'users', permissionKey: 'CanAddUser' }
          },
          {
            path: 'viewers',
            loadComponent: () => import('./resource/resource-viewers/resource-viewers').then(m => m.ResourceViewers),
             canActivate: [ViewPermissionGuard],
             data: { section: 'users', permissionKey: 'CanAddUser' }
          }
        ]
      }
    ]
  }
];
