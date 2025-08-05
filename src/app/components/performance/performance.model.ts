import { PaginationFilter } from "../../shared/models/pagination.model";

export class ProductivityData {
    actualWorkingHours: string;
    productivity: number;
    requestedWorkingHours: number;
    tasksCount: number;
    userCalendarDescription: string;
    workingDay: string;
}

export class UserReportsItems extends PaginationFilter {
    items: ProductivityData[];
    summary: WorkSummary;
}

export class ReportsPagination extends PaginationFilter {
    employeeId: string
    fromDate: string | null = null;
    toDate: string | null = null;
}

export class WorkSummary {
    actualHours: string;
    dailyAverage: string;
    officialHours: string;
    overallProductivity: number;
    totalDays: number;
    totalWorksDays: number;
    totalDistinctTasks: number;
}


export class EfficiencyData {
    taskId: number;
    title: string;
    description: string;
    expectedDuration: string;
    actualDuration: string;
    efficiency: number;
    score: number;
    maxDeliveryDate: string;
    actualDeliveryDate: string;
}

export class UserReportsItems2 extends PaginationFilter {
    items: EfficiencyData[];
    summary: EfficiencySummarry;
}

export class EfficiencySummarry {
    days: number;
    deadlineScore: number;
    overallEfficiency: number;
    totalActualDuration: string;
    totalExpectedDuration: string;
    totalTasks: number;
}

export class ResourceAllocation {
    allocatedTime: string;
    projectId: string;
    projectName: string;
    totalCost: string;
    totalTasks: number;
}

export class ResourceAllocationItems extends PaginationFilter {
    items: ResourceAllocation[];
    summary: ResourceAllocationSummarry;
}

export class ResourceAllocationSummarry {
    totalAllocatedTime: string;
    projectId: string;
    projectName: string;
    totalCost: string;
    totalTasks: number;
    projectsCount:number;
}