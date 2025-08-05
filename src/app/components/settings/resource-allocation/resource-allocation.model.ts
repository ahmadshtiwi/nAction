export class ResourceAllocation {
    id:number;
    timeOfAllocation:string;
    note?:string;
    fromDate:string ;
    toDate:string;
    projectId:string;
    projectName:string ;
    userId:string ;
    userName:string ;
}

export class AllocationTableResponse {
  columns: string[];
  rows: AllocationRow[];
  length:number;

   minDate: string; // yyyy-MM-dd
  maxDate: string; // yyyy-MM-dd
}

export class AllocationRow {
  projectName: string;
  values: string[];
}