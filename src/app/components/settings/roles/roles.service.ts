import { Injectable } from '@angular/core';
import { HttpService } from '../../../../assets/services/http.service';
import { PaginationFilter } from '../../../shared/models/pagination.model';
import { Result } from '../../../shared/models/result';
import { RoleItems, Role } from './roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  controller = 'Roles'

  constructor(private httpService: HttpService) { }

  getAllRole = () => {
    return this.httpService.get<Role[]>(`${this.controller}`);
  }

  getAllPermissions = () => {
    return this.httpService.get<string[]>(`Permissions`);
  }

  getRoleByID = (RoleID : number) => {
    return this.httpService.get<Role>(`${this.controller}/${RoleID}`);
  }

  deleteRole = (RoleID : number) => {
    return this.httpService.delete<Role>(`${this.controller}/${RoleID}`);
  }

  addRole = (Role : Role) => {
    return this.httpService.post<Role>(`${this.controller}` ,  Role);
  }

  updateRole = (Role : Role) => {
    return this.httpService.put<Role>(`${this.controller}/${Role.id}` ,  Role);
  }

  
}
