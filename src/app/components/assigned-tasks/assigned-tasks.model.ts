import { PaginationFilter } from "../../shared/models/pagination.model";

export class OpenTask {
    id: number;
    title: string;
    description: string;
    estimatedDuration: number;
    maxDeliveryDate: string;
    assignmentStatusId: number;
    assignmentStatusName: string;
    projectId: number;
    projectName: string;
    assignedToId: string;
    assignedToName: string;
    createdById: string;
    createdByName: string;
    percentageCompleted: string;
    updatedById: string | null;
    updatedByName: string | null;
    actualDuration: string;
    actualCompletion: string;
}

export class OpenTaskItems extends PaginationFilter {
    items : OpenTask[]
}
export class OpenTaskFilter extends PaginationFilter {
    employeeId : string;
    searchValue : string;
    projectId : string;
    fromDate: string; // Full-date notation as defined by RFC 3339 (e.g., 2017-07-21)
    toDate: string; // Search value for filtering tasks
    sortColumn: string;  // Column name for sorting
    sortDirection: string; // Sorting direction (e.g., "asc" or "desc")
    creatorId: string;   // ID of the creator
    assignedToId: string; // ID of the assignee
    title: string;       // Title for filtering tasks
    statusIds: number[]; // Array of status IDs for filtering tasks
    deadlineFrom: string; // Start date for filtering tasks based on deadline
    deadlineTo: string;   // End date for filtering tasks based on deadline
    estimatedHoursFrom: string; // Minimum estimated hours
    estimatedHoursTo: string;   // Maximum estimated hours
    actualHoursFrom: string;    // Minimum actual hours
    actualHoursTo: string;      // Maximum actual hours
    completionFrom: number;  // Minimum completion value
    completionTo: number;    // Maximum completion value
}