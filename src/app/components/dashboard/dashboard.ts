import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TopResponse, TopTenReq } from '../top-ten/top-ten.model';
import { ReportsPagination } from '../performance/performance.model';
import { PerformanceService } from '../performance/performance.service';
import { UsersService } from '../resource/users.service';
import { LoginService } from '../auth/login/login.service';
import { TopTenService } from '../top-ten/top-ten.service';
import { LineChartComponent } from '../../shared/components/charts/line-chart/line-chart.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from '../../shared/components/charts/pie-chart/pie-chart.component';
import { StatisticChartComponent } from '../../shared/components/charts/statistic-chart/statistic-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [LineChartComponent, NgSelectModule,FormsModule, CommonModule, PieChartComponent, StatisticChartComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit  {
  
  ProductivityPagination: ReportsPagination = new ReportsPagination();
  efficiencyPagination: ReportsPagination = new ReportsPagination();
  resourceAllocationPagination: ReportsPagination = new ReportsPagination();
  productivityLabels:string[]=[];
  productivityData:number[]=[];
  efficiencyLabels:string[]=[];
  efficiencyData:number[]=[];
  resourceAllocationLabels:string[]=[];
  resourceAllocationData:number[]=[];
  topTenLabels:string[]=[];
  topTenData:number[]=[];
  topTenReq: TopTenReq= new TopTenReq();
  employees: TopResponse[] = []; // Empty array for storing employee data

  users: { id: string; fullName: string; }[] = [];

  
  constructor(private performanceService: PerformanceService, private userService: UsersService,
     private loginService : LoginService ,private topTenService:TopTenService){}
  


  ngOnInit(): void {
    

    // تحديد بداية الشهر الحالي
    
    
    
    const today = new Date();
    /*const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);*/
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 2);
    this.ProductivityPagination.fromDate = this.formatDate(fromDate);
    this.ProductivityPagination.toDate = this.formatDate(today);
    this.ProductivityPagination.employeeId = this.loginService.getUser().sub ;

    this.ProductivityPagination.pageSize=100;

    this.userService.getEmployeesForViewer().subscribe(res => {
      if (res) {
        this.users = res;
      }
    });
     this.getDashboardData();
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  
  }


  getTopTenData() 
  {
    this.topTenService.getTopTen(this.topTenReq).subscribe(res=>
    {
      if(res){
        this.employees=res;
        this.storeTopTenData(this.employees);
      }
    });

  } 

  storeTopTenData(source : any[])
  {
    this.topTenLabels = [];
    this.topTenData = [];
      
    source.forEach(element => {
      this.topTenLabels.push(element.fullName);
      this.topTenData.push(element.kpi);
    });
  }
  getDashboardData() {  
    if(!this.ProductivityPagination.employeeId){
      this.ProductivityPagination.employeeId = this.loginService.getUser().sub ;

    }
    this.efficiencyPagination.employeeId = this.ProductivityPagination.employeeId;
    this.efficiencyPagination.fromDate = this.ProductivityPagination.fromDate;
    this.efficiencyPagination.toDate = this.ProductivityPagination.toDate;
    this.efficiencyPagination.pageSize=this.ProductivityPagination.pageSize;
    this.resourceAllocationPagination.employeeId = this.ProductivityPagination.employeeId;
    this.resourceAllocationPagination.fromDate = this.ProductivityPagination.fromDate;
    this.resourceAllocationPagination.toDate = this.ProductivityPagination.toDate;
    this.resourceAllocationPagination.pageSize = this.ProductivityPagination.pageSize;

    this.topTenReq.employeeId= this.loginService.getUser().sub;
    this.topTenReq.fromDate = this.ProductivityPagination.fromDate;
    this.topTenReq.toDate = this.ProductivityPagination.toDate;
    this.getTopTenData();

    forkJoin({
      performance: this.performanceService.getEmployeePerformance(this.ProductivityPagination),
      efficiency: this.performanceService.getEmployeeTaskEfficiency(this.efficiencyPagination),
      resourceAllocation: this.performanceService.getEmployeeResourceAllocation(this.resourceAllocationPagination),
    }).subscribe(({ performance, efficiency,resourceAllocation }) => {
      if (performance) { 
        this.storeProductivity(performance.items);
      }

      if (efficiency) { 
        this.storeEfficiency(efficiency.items);      
      }
      if(resourceAllocation)
      {
        this.storeResourceAllocation(resourceAllocation.items)
      }
    });
  }
  storeProductivity(source: any[]): void {
    this.productivityLabels = [];
    this.productivityData = [];
        const sortedItems = source
      .filter(item => item.productivity !== null)
      .sort((a, b) => new Date(a.workingDay).getTime() - new Date(b.workingDay).getTime());
    sortedItems.forEach(element => {
      this.productivityLabels.push(element.workingDay);
      this.productivityData.push(element.productivity);
    });
  }


  storeEfficiency(source: any[]): void {
   this.efficiencyLabels = [];
   this.efficiencyData = [];
        const sortedItems = source
      .filter(item => item.efficiency !== null)
      .sort((a, b) => new Date(a.maxDeliveryDate).getTime() - new Date(b.maxDeliveryDate).getTime());
    sortedItems.forEach(element => {
      this.efficiencyLabels.push(element.maxDeliveryDate);
      this.efficiencyData.push(element.efficiency);
    });
  }
 
 storeResourceAllocation(source: any[]): void {
    this.resourceAllocationLabels = [];
    this.resourceAllocationData = [];
      
    source.forEach(element => {
      this.resourceAllocationLabels.push(element.projectName);
      this.resourceAllocationData.push(element.totalTasks);
    });
  }
  
}

