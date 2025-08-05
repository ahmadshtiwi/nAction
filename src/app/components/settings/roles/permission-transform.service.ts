import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionTransformService {

  
  transformPermissions(obj: any): UserPermissions {
    return {
      permissions: (obj ?? []).reduce((acc: Record<string, string[]>, perm: string) => {
        const [category, action] = perm.split('|');
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(action);
        return acc;
      }, {})
    };
  }
  

  }

  
  export interface UserPermissions {
    permissions: Record<string, string[]>;
  }