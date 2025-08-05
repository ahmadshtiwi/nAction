import { PaginationFilter } from "../../../shared/models/pagination.model";


export class WorkLogsItems extends PaginationFilter {
  items: WorkLog[];
}

export class WorkLogTask {
  id: number;
  title: string;
  description: string;
  estimatedDuration: number;
  maxDeliveryDate: string;
  assignmentStatusName: string;
  projectName: string;
  assignedToId: string;
  assignedToName: string;
  createdByName: string;
  upstringdByName: string;
  percentageCompleted: string;
  actualCompletion: string;
  actualDurationFormatted: string;
  isCanceled: boolean;
  startDate:string;
  createdOn:string;
  workLogs: WorkLogsItems;
  hasAttachments: boolean;
}

export class WorkLog {
  workLogId: number;
  assignmentId: number;
  createdOn: string;
  description: string;
  fromTime: string;
  toTime: string;
  percentageCompleted: number;
  employeeId: string;
  employeeName: string;
  date: string;
  projectName: string;
  assignmentTitle: string;
  projectCode: any;
  hasAttachments: boolean;
  batchId: string;
}


export class WorkLogFilter extends PaginationFilter {
  employeeId: string;
  SearchValue: string;
  toDate: string;
  fromDate: string;  // Page size for pagination
  searchValue: string; // Search value for filtering
  sortColumn: string;  // Column name for sorting
  sortDirection: string; // Sorting direction ("asc" or "desc")
  projectId: number;   // Project ID for filtering
  filterEmployeeId: string; // Employee ID for filtering
  taskTitle: string;  // Task title for filtering
  dateFrom: string;   // Start date for filtering tasks
  dateTo: string;     // End date for filtering tasks
  fromTimeFrom: string; // Start time range for filtering
  fromTimeTo: string;   // End time range for filtering
  toTimeFrom: string;   // Start time range for filtering
  toTimeTo: string;     // End time range for filtering
  description: string;  // Task description for filtering
  title: string;        // Task title for filtering
  completionFrom: number;  // Minimum completion value (e.g., percentage or progress)
  completionTo: number;
}
