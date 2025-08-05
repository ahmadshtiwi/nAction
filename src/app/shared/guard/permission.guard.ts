import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { LoginService } from "../../components/auth/login/login.service";

@Injectable({ providedIn: 'root' })
export class ViewPermissionGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const section = route.data['section'] as keyof Permissions;
    const permissionKey = route.data['permissionKey'] as string;

    const flags = this.authService.getUser().flags;
    const hasPermission = flags?.[section]?.[permissionKey];

    if (hasPermission) {
      return true;
    }

    // Redirect or show "not authorized" page
    this.router.navigate(['/pages']);
    return false;
  }
}
