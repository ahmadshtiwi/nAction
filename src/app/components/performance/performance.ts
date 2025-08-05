import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EfficiencyData, EfficiencySummarry, ProductivityData, ReportsPagination, ResourceAllocation, ResourceAllocationSummarry, WorkSummary } from './performance.model';
import { NgbDatepickerModule, NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../resource/users.service';
import { LoginService } from '../auth/login/login.service';
import { AssignedTasksService } from '../assigned-tasks/assigned-tasks.service';
import { CacheService } from '../../shared/services/cache.service';
import { PerformanceService } from './performance.service';
import { forkJoin } from 'rxjs';
import { Table } from "../../shared/components/table/table";
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-performance',
  imports: [Table,FormsModule,NgbDropdownModule,NgSelectModule,NgbDatepickerModule],
  templateUrl: './performance.html',
  styleUrl: './performance.scss'
})
export class Performance  implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  ProductivityHeaderTitle = 'Productivity Part';
  efficiencyHeaderTitle = 'Efficiency Part';
  allocationHeaderTitle = 'Resource Allocation Per Project';
  tableHeaders = ['Working Day',  'Day Description ' , 'Official Hours', 'Actual Working Hours', 'Productivity', 'Distinct Tasks Count'];
  tableHeaders2 = ['Task Title', 'Est.Duration', 'Act.Duration', 'Efficiency', 'Deadline', 'Delivery Date', 'Score'];
  tableHeaders3 = [ 'Project Name', 'Spent Time', 'Total Tasks', 'Total Cost'];
  ProductivityData: ProductivityData[] = [];
  efficiencyData: EfficiencyData[] = [];
  resourceAllocation: ResourceAllocation[] = [];

  ProductivityPagination: ReportsPagination = new ReportsPagination();
  efficiencyPagination: ReportsPagination = new ReportsPagination();
  resourceAllocationPagination: ReportsPagination = new ReportsPagination();
  
  statuses: { name: string }[] = [];
  users: { id: string; fullName: string; }[] = [];
  productivityCard : WorkSummary = new WorkSummary();
  efficiencyCard : EfficiencySummarry = new EfficiencySummarry();
  productCard : ResourceAllocationSummarry = new ResourceAllocationSummarry();
  componentName='ReportComponent'

  constructor(
    private offcanvasService: NgbOffcanvas, private userService: UsersService, 
    private performanceService: PerformanceService, private loginService : LoginService,private spinnerService:SpinnerService,
    private cacheService:CacheService<ReportsPagination>
  ) { }

  ngOnInit(): void { debugger
    
    if(this.cacheService.getPageState(this.componentName))
    {
      this.ProductivityPagination=this.cacheService.getPageState(this.componentName);
      this.getLookups()
    }
    else{
      this.getLookups()
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7); // Corrected from 'yesterday'
  
      
      this.ProductivityPagination.fromDate = this.formatDate(sevenDaysAgo);
      this.ProductivityPagination.toDate = this.formatDate(yesterday);    

      this.cacheService.savePageState(this.componentName,this.ProductivityPagination);

    }
    
    
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  }

  getLookups() {
    this.spinnerService.show();
    if(!this.ProductivityPagination.employeeId)
    this.ProductivityPagination.employeeId = this.loginService.getUser().sub ;
    this.ProductivityPagination.pageSize = 1000000;

    
    this.userService.getEmployeesForViewer().subscribe(res => {
      if (res) {
        this.getDashboardData();
        this.users = res;
        this.ProductivityPagination.pageSize = 10;

        this.spinnerService.hide();
      }
    })
  }


  getDashboardData() { 
    if(!this.ProductivityPagination.employeeId){
      return
    }
    this.cacheService.savePageState(this.componentName,this.ProductivityPagination)
    this.efficiencyPagination.employeeId = this.ProductivityPagination.employeeId;
    this.resourceAllocationPagination.employeeId = this.ProductivityPagination.employeeId;
    this.efficiencyPagination.fromDate = this.ProductivityPagination.fromDate;
    this.efficiencyPagination.toDate = this.ProductivityPagination.toDate;
    this.resourceAllocationPagination.fromDate = this.ProductivityPagination.fromDate;
    this.resourceAllocationPagination.toDate = this.ProductivityPagination.toDate;
    this.ProductivityPagination.pageSize = 7;
    this.resourceAllocationPagination.pageSize = 7;
    this.efficiencyPagination.pageSize = 7;
    forkJoin({
      performance: this.performanceService.getEmployeePerformance(this.ProductivityPagination),
      efficiency: this.performanceService.getEmployeeTaskEfficiency(this.efficiencyPagination),
      resourceAllocation: this.performanceService.getEmployeeResourceAllocation(this.resourceAllocationPagination)
    }).subscribe(({ performance, efficiency, resourceAllocation }) => {
      if (performance) {
        this.ProductivityData = performance.items;

        this.productivityCard = performance.summary;
          
        
        this.ProductivityPagination.totalCount = performance.totalCount;
        this.ProductivityPagination.totalPages = performance.totalPages;
        this.ProductivityPagination.pageNumber = performance.pageNumber;
      }

      if (efficiency) {
        this.efficiencyData = efficiency.items;

        this.efficiencyCard = efficiency.summary;
        this.efficiencyPagination.totalCount = efficiency.totalCount;
        this.efficiencyPagination.totalPages = efficiency.totalPages;
        this.efficiencyPagination.pageNumber = efficiency.pageNumber;
      }

      if (resourceAllocation) {
        this.resourceAllocation = resourceAllocation.items;

        this.productCard = resourceAllocation.summary;
        this.resourceAllocationPagination.totalCount = resourceAllocation.totalCount;
        this.resourceAllocationPagination.totalPages = resourceAllocation.totalPages;
        this.resourceAllocationPagination.pageNumber = resourceAllocation.pageNumber;
      }
    });
  }

  productivityColumns = (data: ProductivityData) => {
    return [
      { isFulllDate: true, text: data.workingDay },
      { isText: true, text: data.userCalendarDescription },
      { isTime: true, text: data.requestedWorkingHours.toString() },
      { isTime: true, text: data.actualWorkingHours.toString(),link:`/pages/log/${this.ProductivityPagination.employeeId}/${data.workingDay}` },
      { 
        isText: true, 
        text: data.requestedWorkingHours.toString() === '00:00:00' && data.actualWorkingHours.toString() === '00:00:00' 
          ? '-' 
          : (data.actualWorkingHours.toString() !== '00:00:00' && data.productivity == null 
              ? 'Extra Time' 
              : (data.productivity?.toString() ?? '0') + '%'
            )
      },
      { isText: true, text: data.tasksCount.toString() },
    ];
};


  efficiencyColumns = (data: EfficiencyData) => {
    return [
      { isText: true, text: data.taskId + ' - ' + data.title , link:`/pages/tasks/${data.taskId}` },
      { isText: true, text: data.expectedDuration.toString() + ' hrs' },
      { isText: true, text: data.actualDuration.toString() + ' hrs' },
      { isText: true, text: data.efficiency.toString() + '%' },
      { isDate: true, text: data.maxDeliveryDate },
      { isDate: true, text: data.actualDeliveryDate },
      { isText: true, text: data.score.toString() }
    ];
  };

  resourceAllocationColumns = (data: ResourceAllocation) => {
    return [
      { isText: true, text: data.projectName , },
      { isText: true, text: data.allocatedTime + ' hrs' ,  link:`/pages/log/${this.ProductivityPagination.employeeId}/${this.ProductivityPagination.fromDate}/${this.ProductivityPagination.toDate}/${data.projectId}`},
      { isText: true, text: data.totalTasks.toString() },
      { isMony: true, text: data.totalCost },
    ];
  };

  performanceNextPage(newPage: number) {
    this.ProductivityPagination.pageNumber = newPage;
    this.getDashboardData()
  }

  efficiencyNextPage(newPage: number) {
    this.efficiencyPagination.pageNumber = newPage;
    this.getDashboardData()
  }

  resourceAllocationNextPage(newPage: number) {
    this.resourceAllocationPagination.pageNumber = newPage;
    this.getDashboardData()
  }

  openModal(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

}
