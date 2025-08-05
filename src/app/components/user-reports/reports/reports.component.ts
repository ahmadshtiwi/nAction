import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {  NgbDatepickerModule, NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../shared/components/table/table.component';
import { OpenTasksService } from '../open-tasks.service';
import { EfficiencySummarry, ReportsPagination, ProductivityData, EfficiencyData, WorkSummary, ResourceAllocation, ResourceAllocationSummarry } from './reports.model';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/users.model';
import { forkJoin } from 'rxjs';
import { LoginService } from '../../authorization/login/login.service';

@Component({
  selector: 'app-reports',
  standalone:true,
  imports: [TableComponent, FormsModule, NgbDropdownModule, NgSelectModule , NgbDatepickerModule ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  ProductivityHeaderTitle = 'Productivity Part';
  efficiencyHeaderTitle = 'Efficiency Part';
  allocationHeaderTitle = 'Resource allocation per project';
  tableHeaders = ['Working Day',  'Day Description ' , 'Official hours', 'Actual working hours', 'Productivity', 'Distinct Tasks Count'];
  tableHeaders2 = ['Task Title', 'Est.Duration', 'Act.Duration', 'Efficiency', 'Deadline', 'Delivery Date', 'Score'];
  tableHeaders3 = [ 'ProjectName', 'Spent Time', 'Total Tasks', 'Total Cost'];
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

  constructor(private offcanvasService: NgbOffcanvas, private userService: UsersService, private opentaskService: OpenTasksService, private loginService : LoginService) { }

  ngOnInit(): void {
    this.getLookups()
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // Corrected from 'yesterday'
    
    this.ProductivityPagination.fromDate = this.formatDate(sevenDaysAgo);
    this.ProductivityPagination.toDate = this.formatDate(yesterday);    
    
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  }

  getLookups() {
    this.ProductivityPagination.employeeId = this.loginService.getUser().sub ;
    this.ProductivityPagination.pageSize = 1000000;
    this.userService.getEmployeesForViewer().subscribe(res => {
      if (res) {
        this.getDashboardData();
        this.users = res;
        this.ProductivityPagination.pageSize = 10;
      }
    })
  }


  getDashboardData() {
    if(!this.ProductivityPagination.employeeId){
      return
    }
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
      performance: this.opentaskService.getEmployeePerformance(this.ProductivityPagination),
      efficiency: this.opentaskService.getEmployeeTaskEfficiency(this.efficiencyPagination),
      resourceAllocation: this.opentaskService.getEmployeeResourceAllocation(this.resourceAllocationPagination)
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
      { isTime: true, text: data.actualWorkingHours.toString() },
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
      { isText: true, text: data.taskId + ' - ' + data.title },
      { isText: true, text: data.expectedDuration.toString() + ' hrs' },
      { isText: true, text: data.actualDuration.toString() + ' hrs' },
      { isText: true, text: data.efficiency.toString() + '%' },
      { isText: true, text: data.maxDeliveryDate },
      { isText: true, text: data.actualDeliveryDate },
      { isText: true, text: data.score.toString() }
    ];
  };

  resourceAllocationColumns = (data: ResourceAllocation) => {
    return [
      { isText: true, text: data.projectName },
      { isText: true, text: data.allocatedTime + ' hrs' },
      { isText: true, text: data.totalTasks.toString() },
      { isText: true, text: data.totalCost },
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
