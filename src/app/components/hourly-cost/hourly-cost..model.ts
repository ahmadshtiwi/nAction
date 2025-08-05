export class HourlyCost{
    id : number;
    fromDate: string ; 
    toDate : string ;
    hourlyRate : number;
    notes : string | null;
    userId : string ;

}


export class HourlyCostProcudre{
    employeeId: string;
    fullName:string;
    totalCost: number;

}
