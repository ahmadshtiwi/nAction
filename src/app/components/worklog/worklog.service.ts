import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultData, WorkLog, WorkLogsItems, WorkLogTask } from './worklog.model';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogService {

    
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

  getDefaultData =(date:string):Observable<DefaultData> =>{

    return this.httpService.get<DefaultData>(`${this.controller}/getDefaultData/${date}`)
  };
  
}
