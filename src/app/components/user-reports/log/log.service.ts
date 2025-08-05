import { Injectable } from '@angular/core';
import { WorkLog, WorkLogsItems, WorkLogTask } from './log.model';
import { HttpService } from '../../../../assets/services/http.service';
import { PaginationFilter } from '../../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  controller = 'WorkLogs'

  constructor(private httpService: HttpService) { }

  getAllWorkLogs = (pagination : PaginationFilter) => {
    return this.httpService.get<WorkLogsItems>(`${this.controller}/employees` , {body : pagination});
  }

  getWorkLogsByID = (WorkLogsID : number) => {
    return this.httpService.get<WorkLog>(`${this.controller}/${WorkLogsID}`);
  }

  deleteWorkLogs = (WorkLogsID : number) => {
    return this.httpService.delete<WorkLog>(`${this.controller}/${WorkLogsID}`);
  }

  addWorkLogs = (WorkLogs : WorkLog) => {
    return this.httpService.post<WorkLog>(`${this.controller}` ,  WorkLogs);
  }

  updateWorkLogs = (WorkLogs : WorkLog) => {
    return this.httpService.put<WorkLog>(`${this.controller}/${WorkLogs.workLogId}` ,  WorkLogs);
  }
  
  getLogsByTaskID = (taskId : string , pagination : PaginationFilter) => {
    return this.httpService.get<WorkLogTask>(`${this.controller}/assignment/${taskId}` , {body : pagination});
  }
  
}
