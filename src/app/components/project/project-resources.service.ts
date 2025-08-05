import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { ProjectItems } from './projects/projects.model';
import { ProjectResources, ProjectResourcesPagination } from './project-resources/project-resources.model';
import { Result } from '../../shared/models/result';

@Injectable({
  providedIn: 'root'
})
export class ProjectResourcesService {

  constructor(private httpService: HttpService) { }
  
  getProjectResources = (pagination : PaginationFilter , projectId : number) => {
    return this.httpService.get<ProjectResourcesPagination>(`ProjectResources/by-project/${projectId}`);
  }

  getProjectResourcesByID = (projectResource : ProjectResources) => {
    return this.httpService.get<any>(`ProjectResources/${projectResource.id}`);
  }
  
  deleteProjectResources = ( projectId : number) => {
    return this.httpService.delete<ProjectResourcesPagination>(`ProjectResources/${projectId}`);
  }
  
  addProjectResource = (projectResource : ProjectResources) => {
    return this.httpService.post<ProjectItems>(`ProjectResources` , projectResource);
  }
  
  updateProjectResource = (projectResource : ProjectResources) => {
    return this.httpService.put<ProjectItems>(`ProjectResources/${projectResource.id}` , projectResource);
  }
}
