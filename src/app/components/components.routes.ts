import { Routes } from "@angular/router";
import { authGuard } from "../shared/services/auth.guard";

export const COMPONENTS_ROUTES: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full" // Ensures the path matches the full URL
    },
    {
        path: "login",
        loadComponent: () => import('./authorization/login/login.component')
            .then(m => m.LoginComponent) // Correctly lazy-loads the LoginComponent
    },
    {
        //Ahmad Shtiwi
        path:"forget-password",
        loadComponent:()=>   import("./authorization/forget-password/forget-password.component")
            .then(m=>m.ForgetPasswordComponent)
        
    },

    {
        //Ahmad Shtiwi
        path:"reset-password",
        loadComponent:()=>   import("./authorization/reset-password/reset-password.component")
            .then(m=>m.ResetPasswordComponent)
        
    },
    {
        path: "pages",
        canActivate : [authGuard],
        loadComponent: () => import('./layout/layout.component')
            .then(m => m.LayoutComponent), // Ensure you're loading the correct parent component for "pages"
        children: [
            {
                path : 'tasks',
                loadComponent : () => import('./tasks/tasks.component').then(m => m.TasksComponent)
            },
            {
                path : 'log',
                loadComponent : () => import('./user-reports/log/log.component').then(m => m.LogComponent)
            },
            {
                path : 'tasks/:id',
                loadComponent : () => import('./user-reports/log/log.component').then(m => m.LogComponent)
            },
            {
                path : 'projects',
                loadComponent : () => import('./project/projects/projects.component').then(m => m.ProjectsComponent)
            },
            {
                path : 'project-resource/:projectId/:projectName',
                loadComponent : () => import('./project/project-resources/project-resources.component').then(m => m.ProjectResourcesComponent)
            },
            {
                path : 'users',
                loadComponent : () => import('./users/users.component').then(m => m.UsersComponent)
            },
            {
                path : 'roles',
                loadComponent : () => import('./settings/roles/roles.component').then(m => m.RolesComponent)
            },
            {
                path : 'open-tasks',
                loadComponent : () => import('./user-reports/open-tasks/open-tasks.component').then(m => m.OpenTasksComponent)
            },
            {
                path : 'user-reports',
                loadComponent : () => import('./user-reports/reports/reports.component').then(m => m.ReportsComponent)
            },
            {
                path : 'project-costs',
                loadComponent : () => import('./user-reports/project-costs/project-costs.component').then(m => m.ProjectCostsComponent)
            },
            {
                path : 'app-settings',
                loadComponent : () => import('./settings/app-settings/app-settings.component').then(m => m.AppSettingsComponent)
            },
            {
                path : 'user-calendar',
                loadComponent : () => import('./settings/user-calendar/user-calendar.component').then(m => m.UserCalendarComponent)
            },
            {
                path : 'user-calendar/:id/:name',
                loadComponent : () => import('./settings/user-calendar/user-calendar.component').then(m => m.UserCalendarComponent)
            },
            {
                path : 'hourly-cost/:id/:name',
                loadComponent : () => import('./settings/hourly-cost/hourly-cost.component').then(m => m.HourlyCostComponent)
            },
            {
                path : 'user-calendar-desc',
                loadComponent : () => import('./settings/calendar-description/calendar-description.component').then(m => m.CalendarDescriptionComponent)
            },
            {
                path : 'top_ten',
                loadComponent : () => import('./top-ten/top-ten.component').then(m => m.TopTenComponent)
            },
        ]
    }
];