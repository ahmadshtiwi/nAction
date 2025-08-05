import { PaginationFilter } from "../../shared/models/pagination.model";

export class ProjectResources {
    id : number;
    projectId: number;
    resourceId: number;
    canCreateTasks: boolean;
    canSeeCost: boolean;
    resourceFullName : string;
}

export class ProjectResourcesPagination extends PaginationFilter {
    items : ProjectResources[] = []
}