import { Injectable } from "@angular/core";
import { HttpService } from "../../shared/services/http.service";
import { ProjectCostItems, ProjectCostPagination } from "./project-cost.model";

@Injectable({
  providedIn: 'root'
})

export class ProjectCostService {
  constructor(private httpService: HttpService) { }

  getProjectCost = (pagination : ProjectCostPagination) => {
    return this.httpService.get<ProjectCostItems>(`Reports/ProjectCost` , {body : pagination});
  }
}