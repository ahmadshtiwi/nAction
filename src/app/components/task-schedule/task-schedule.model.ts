export class TaskScheduleRequest{
    fromDate :string;
    toDate:string;
    employeeId:string;
}
export class TaskScheduleResponse{
        userId:   string ;                    
        date:     string ;                    
        dayName:      string ;                
        taskId:   string ;                    
        newDuration:      number ;            
        newDurationFormat:    string ;        
        isMisssid:    boolean ;               
        title:    string ;        
        fullName:string;
        estimatedDuration: number;
        estimatedDurationFormat: string;
        startDate:string;
        maxDeliveryDate: string;
        percentageCompleted: number
}
export type TaskScheduleMatrix = Record<string, Record<string, string>>;
