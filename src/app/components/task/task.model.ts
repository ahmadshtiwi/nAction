import { PaginationFilter } from "../../shared/models/pagination.model";

export class Tasks {
  id: number;
  title: string;
  description: string;
  estimatedDuration: string;
  maxDeliveryDate: string;
  startDate: string=null;
  assignmentStatusId: number;
  assignmentStatusName: string;
  projectId: number;
  projectName: string;
  assignedToId: string;
  assignedToName: string;
  createdById: string;
  createdByName: string;
  percentageCompleted: number;
  updatedById: string;
  updatedByName: string;
  actualDuration: number | null;
  actualCompletion: string | null;
  createdOn: string;
  batchId : string = null;
  hasAttachments : boolean;
  projectCode: string;

  flexibleDuration:boolean;
  flexibleDeadLine:boolean;
}


export class TasksItems extends PaginationFilter {
  items: Tasks[];
}
export class TasksFilter extends PaginationFilter {
  SearchValue: string;
  EmployeeId: string;
  PageNumber: number;  // Page number for pagination
  PageSize: number;    // Page size for pagination
  SortColumn: string;  // Column to sort by
  SortDirection: string; // Direction of sorting (e.g., "asc" or "desc")
  ProjectId: number;   // Project ID to filter by
  CreatorId: string;   // ID of the creator
  AssignedToId: string; // ID of the assigned user
  StatusIds: number[]; // Array of status IDs to filter by
  CreationDateFrom: string; // Start date for creation date range
  CreationDateTo: string;   // End date for creation date range
  DeadlineFrom: string;     // Start date for deadline range
  DeadlineTo: string;       // End date for deadline range
  EstimatedHoursFrom: string; // Minimum estimated hours
  EstimatedHoursTo: string;   // Maximum estimated hours
  ActualHoursFrom: string;    // Minimum actual hours
  ActualHoursTo: string;      // Maximum actual hours
  canEnter : boolean;
  Title: string;              // Title of the task

}

export class RejectModel{

   Id:number ;
   NewStatusId:number;
   reason:string ;
   compleation:number;

}