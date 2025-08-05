import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { Result } from '../../shared/models/result';
import { Project, ProjectItems } from './projects/projects.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

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
