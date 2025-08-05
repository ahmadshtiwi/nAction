import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { OpenTaskItems } from './assigned-tasks.model';
import { PaginationFilter } from '../../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class AssignedTasksService {


  constructor(private httpService: HttpService) { }

  getAllAssignmentEmployee = (pagination : PaginationFilter) => {
    return this.httpService.get<OpenTaskItems>(`Assignments/employee` , {body : pagination});
  }

  // getEmployeePerformance = (pagination : PaginationFilter) => {
  //   return this.httpService.get<UserReportsItems>(`Reports/EmployeePerformance` , {body : pagination});
  // }

  // getEmployeeTaskEfficiency = (pagination : PaginationFilter) => {
  //   return this.httpService.get<UserReportsItems2>(`Reports/TaskEfficiency` , {body : pagination});
  // }

  // getEmployeeResourceAllocation = (pagination : PaginationFilter) => {
  //   return this.httpService.get<ResourceAllocationItems>(`Reports/EmployeeResourceLocation` , {body : pagination});
  // }

  // getProjectCost = (pagination : ProjectCostPagination) => {
  //   return this.httpService.get<ProjectCostItems>(`Reports/ProjectCost` , {body : pagination});
  // }
}
