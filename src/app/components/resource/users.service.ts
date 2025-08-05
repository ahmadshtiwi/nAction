import { Injectable } from '@angular/core';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { User, UserItems, UserViewerAdd, ViewerMatrixRow } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  controller = 'Users'

  constructor(private httpService: HttpService) { }

  getAllUser = (pagination : PaginationFilter) => {
    return this.httpService.get<UserItems>(`${this.controller}` , {body : pagination});
  }

  getEmployeesForViewer = () => {
    return this.httpService.get<{id : string , fullName :  string}[]>(`UserViewer/users`);
  }

  getUserByID = (UserID : string) => {
    return this.httpService.get<User>(`${this.controller}/${UserID}`);
  }

  deleteUser = (UserID : number) => {
    return this.httpService.delete<User>(`${this.controller}/${UserID}`);
  }

  addUser = (User : User) => {
    return this.httpService.post<User>(`${this.controller}` ,  User);
  }

  resetPassword = (newPassword : string , id : string) => {
    return this.httpService.put<User>(`${this.controller}/admin-reset-password/${id}` , {newPassword : newPassword});
  }

  updateUser = (User : User) => {
    return this.httpService.put<User>(`${this.controller}/${User.id}` ,  User);
  }

  unlockUser = (User : User) => {
    
    return this.httpService.put<User>(`${this.controller}/${User.id}/unlock` ,  User);
  }

getViewers(): Observable<ViewerMatrixRow[]> {
 return this.httpService.get("UserViewer/viewers"); 
}

addOrRemove (request:UserViewerAdd) :Observable<boolean>{

  return this.httpService.post("UserViewer/add-or-remove",request);
}

}