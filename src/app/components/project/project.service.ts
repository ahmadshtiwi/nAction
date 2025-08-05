import { Injectable } from "@angular/core";
import { HttpService } from "../../shared/services/http.service";
import { ProjectCostPagination } from "../project-cost/project-cost.model";
import { PaginationFilter } from "../../shared/models/pagination.model";
import { Project, ProjectItems } from "./projects.model";

@Injectable({
    providedIn:'root'
})
export class ProjectService {

 
  controller = 'Projects'

  constructor(private httpService: HttpService) { }

  getAllProject = (pagination : PaginationFilter) => {
    return this.httpService.get<ProjectItems>(`${this.controller}` , {body : pagination});
  }


  getProjectByID = (ProjectID : number) => {
    return this.httpService.get<Project>(`${this.controller}/${ProjectID}`);
  }

  deleteProject = (ProjectID : number) => {
    return this.httpService.delete<Project>(`${this.controller}/${ProjectID}`);
  }

  addProject = (Project : Project) => {
    return this.httpService.post<Project>(`${this.controller}` ,  Project);
  }

  updateProject = (Project : Project) => {
    return this.httpService.put<Project>(`${this.controller}/${Project.id}` ,  Project);
  }
  
}