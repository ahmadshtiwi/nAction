export class UserCalendar {
  id: number;
  dayName: string;
  requiredWorkingHours: string;
  description: string;
  date: string;
  calendarDescriptionLookupId: number;
}

export class BackLogDays {
  backlogDays: number;
}

export class TaskParameters {
  Backlog_Days: string;
  Reject_Prefix: string;
  InactiveTaskProject: string | null;
  InactiveTaskTitle: string;
  InactiveTaskDesc: string;
  InactiveTaskDuration: string;
  InactiveTaskResource: string;
  TaskDurationHours?: number;
  TaskDurationMinutes?: number;
}
export class Parameters {
  parameters : TaskParameters;
}

export class parametersRequest{
  paramName : string;
  paramValue : string;
}

export class parametersRequestArray{
  parameters : parametersRequest[]
}