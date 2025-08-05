import { PaginationFilter } from "../../../shared/models/pagination.model";

export class ProjectCostPagination extends PaginationFilter {
    projectId : number;
    fromDate :  string;
    toDate : string;
}

export class ProjectCost {
    projectName: string;
    employee: string;
    hours: string;
    hoursPercentage: number;
    cost: string;
    costPercentage: string;
}


export class ProjectCostItems extends PaginationFilter {
    items : ProjectCost[];
    summary : ProjectCostSummary
}

export class ProjectCostSummary {
    totalCost: string;
    totalHours: string;
    totalResources: number;
    totalCount: number
}