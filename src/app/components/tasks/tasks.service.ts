import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { RejectModel, Tasks, TasksItems } from './tasks.model';
import { Result } from '../../shared/models/result';
import { PaginationFilter } from '../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  controller = 'Assignments'

  constructor(private httpService: HttpService) { }

  getAllTasks = (pagination : PaginationFilter) => {
    return this.httpService.get<TasksItems>(`${this.controller}` , {body : pagination});
  }

  getTaskByID = (taskID : number) => {
    return this.httpService.get<Tasks>(`${this.controller}/${taskID}`);
  }

  deleteTask = (taskID : number) => {
    return this.httpService.delete<Tasks>(`${this.controller}/${taskID}`);
  }

  addTask = (task : Tasks) => {
    return this.httpService.post<Tasks>(`${this.controller}` ,  task);
  }

  updateTask = (task : Tasks) => {
    return this.httpService.put<Tasks>(`${this.controller}/${task.id}` ,  task);
  }
  updateStatus = (id : number , newStatusId : number) => {
    return this.httpService.put<Tasks>(`${this.controller}/status` ,  {id , newStatusId});
  }

  updateStatusReject = (reject:RejectModel,) => {
    return this.httpService.put<Tasks>(`${this.controller}/status` ,  reject);
  }
  taskStatuses = () => {
    return this.httpService.get<{name : string}[]>(`AssignmentStatuses`);
  }

  
}
