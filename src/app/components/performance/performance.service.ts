import { Injectable } from "@angular/core";
import { PaginationFilter } from "../../shared/models/pagination.model";
import { OpenTaskItems } from "../assigned-tasks/assigned-tasks.model";
import { HttpService } from "../../shared/services/http.service";
import { ResourceAllocationItems, UserReportsItems, UserReportsItems2 } from "./performance.model";

@Injectable({
    providedIn:'root'
})

export class PerformanceService{

      constructor(private httpService: HttpService) { }

      getAllAssignmentEmployee = (pagination : PaginationFilter) => {
    return this.httpService.get<OpenTaskItems>(`Assignments/employee` , {body : pagination});
  }

  getEmployeePerformance = (pagination : PaginationFilter) => {
    return this.httpService.get<UserReportsItems>(`Reports/EmployeePerformance` , {body : pagination});
  }

  getEmployeeTaskEfficiency = (pagination : PaginationFilter) => {
    return this.httpService.get<UserReportsItems2>(`Reports/TaskEfficiency` , {body : pagination});
  }

  getEmployeeResourceAllocation = (pagination : PaginationFilter) => {
    return this.httpService.get<ResourceAllocationItems>(`Reports/EmployeeResourceLocation` , {body : pagination});
  }
}