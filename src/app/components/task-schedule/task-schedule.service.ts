import { Observable } from "rxjs";
import { HttpService } from "../../shared/services/http.service";
import { TaskScheduleRequest, TaskScheduleResponse } from "./task-schedule.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TaskScheduleService {

  controller: string = 'TaskSchedule';

  constructor(private apiHelper:HttpService) { }


  getTaskSchdule= (taskScheduleRequest :TaskScheduleRequest):Observable<TaskScheduleResponse[]>=>{
 
    return this.apiHelper.get<TaskScheduleResponse[]>(`TaskSchedule`,{body : taskScheduleRequest});

  }

  getTaskSchduleMatrex= (taskScheduleRequest :TaskScheduleRequest):Observable<Record<string, Record<string, string>>  >=>{
 
    return this.apiHelper.get<Record<string, Record<string, string>>>(`TaskSchedule`,{body : taskScheduleRequest});

  }
   
}
