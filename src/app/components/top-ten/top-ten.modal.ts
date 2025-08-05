export class TopTenReq {
    employeeId:string;
    fromDate:string;
    toDate:string;
}

export class TopResponse {
    userId: string;
    fullName: string;
    officialDays: number;
    officialHours: number;
    actualHours: string; // Or number, if you want to handle it as a time calculation
    efficiency: number;
    performanceScore: number;
    productivity: number;
    averageDeadlineScore: number;
    kpi: number;
}