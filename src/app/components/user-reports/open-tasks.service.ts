import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { OpenTaskItems } from './open-tasks/open-tasks.model';
import { ResourceAllocationItems, UserReportsItems, UserReportsItems2 } from './reports/reports.model';
import { ProjectCostItems, ProjectCostPagination } from './project-costs/project-cost.model';

@Injectable({
  providedIn: 'root'
})
export class OpenTasksService {


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

  getProjectCost = (pagination : ProjectCostPagination) => {
    return this.httpService.get<ProjectCostItems>(`Reports/ProjectCost` , {body : pagination});
  }
}
