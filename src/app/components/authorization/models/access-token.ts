
export class AccessToken{
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    jti: string;
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
    };
  
    tasks: {
      CanViewActiveTasks: boolean;
      CanViewEmployeeDailyWork: boolean;
    };
  }
  