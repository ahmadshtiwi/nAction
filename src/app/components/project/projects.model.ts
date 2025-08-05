import { ResourcesType } from "../../shared/models/enums";
import { PaginationFilter } from "../../shared/models/pagination.model";

export class Project {
  id: number;
  projectCode: string;
  projectName: string;
  isActive: boolean = true;
  batchId: string;
  hasAttachment: boolean;
  resourcesType : ResourcesType;
  imageURL: string;
}

export class ProjectItems extends PaginationFilter {
  items: Project[];
}

export class ProjectFilter extends PaginationFilter {
  SearchValue: string;
}