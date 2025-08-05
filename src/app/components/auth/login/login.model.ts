export class LogIn {

    email: string;
    password: string;
}

export class LoggedInUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiration: string
    errors: string[];
  }
export class Password{
    currentPassword : string;
    newPassword : string;
    confirmPassword
}

export class AccessToken{
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    jti: string;
    userImageUrl :string;
    dayImageUrl:string;
    headerText:string;
    roles: string[];
    permissions: string[];
    errors: string[];
    IsAdmin: string;
    exp: number;
    iss: string;
    aud: string;
    flags : Permissions;
  }

  export class Permissions {
    roles: {
      CanViewRoles: boolean;
      CanAddRole: boolean;
      CanUpdateRole: boolean;
      CanDeleteRole: boolean;
    };
  
    users: {
      CanAddUser: boolean;
      CanUpdateUser: boolean;
    };
  
    projects: {
      CanViewProjects: boolean;
      CanAddProject: boolean;
      CanUpdateProject: boolean;
      CanDeleteProject: boolean;
    };
  
    calendar: {
      CanManageAppCalendar: boolean;
      CanViewEmployeeCalendar: boolean;
    };
  
    reports: {
      CanViewEmployeePerformanceReport: boolean;
      CanViewTaskEfficiencyReport: boolean;
      CanViewProjectCostsReport: boolean;
      CanViewTopTenReport: boolean;
      CanViewTaskSchedule: boolean;
    };
    dashboard:{
      CanViewDashboard:boolean;
    };
   allocation:{
      CanViewAllocation:boolean;
    };
    tasks: {
      CanViewActiveTasks: boolean;
      CanViewEmployeeDailyWork: boolean;
    };
  }