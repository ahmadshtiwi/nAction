import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LookUpsService {
  controller: string = 'Lookups';

  constructor(private httpService : HttpService) { }

    getAllUser = () => {
      return this.httpService.get<{id : string , fullName : string}[]>(`${this.controller}/users`);
    }

    getUsersByProjectId = (projectId : number) => {
      return this.httpService.get<{id : string , fullName : string}[]>(`${this.controller}/users-for-project/${projectId}`);
    }

    getAllProjectsForTasks = () => {
      return this.httpService.get<{id : number , name : string , imageURL : string}[]>(`${this.controller}/projects-for-tasks`);
    }

    getAllProjectsForCost = () => {
      return this.httpService.get<{id : number , name : string , imageURL : string}[]>(`${this.controller}/projects-for-cost`);
    }

    getAllProjects = (userId?:string) => {
      return this.httpService.get<{id : number , name : string , imageURL : string}[]>(`${this.controller}/projects`,{body:{userId}});
    }
  
}
