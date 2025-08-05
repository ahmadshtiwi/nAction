import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from "../../shared/components/table/table";
import { OpenTask, OpenTaskFilter } from './assigned-tasks.model';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../resource/users.service';
import { CacheService } from '../../shared/services/cache.service';
import { AssignedTasksService } from './assigned-tasks.service';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { LoginService } from '../auth/login/login.service';
import { forkJoin } from 'rxjs';
import { SpinnerService } from '../../shared/services/spinner.service';

@Component({
  selector: 'app-assigned-tasks',
  imports: [Table],
  templateUrl: './assigned-tasks.html',
  styleUrl: './assigned-tasks.scss'
})
export class AssignedTasks implements OnInit {
  componentName ="OpenTasksComponent";
  @ViewChild('content') content!: TemplateRef<any>;
  tableHeaderTitle = 'Active Tasks';
  tableHeaders = ['Deadline', 'Project', 'Task Title', 'Creator' ,'Assigned to', 'Est. Hrs', 'Act. Hrs','Status' , 'Completed%' ,'Log'];
  tableData: OpenTask[] = [];
  pagination: OpenTaskFilter = new OpenTaskFilter();
  statuses : {name : string}[] = [];
  users: { id: string; fullName: string; }[] = [];
  projects:{id : number , name : string , imageURL : string}[] = [];
  columnFilters = {};
  filters: Record<string, any> = {};
  transformedProjects: {
name: string; value: number; // Convert the 'id' string to a number for the 'value'
  }[];
  transformedUsers: {
    name: string; value: string; // Convert the 'id' string to a number for the 'value'
  }[];


  constructor(
    private offcanvasService: NgbOffcanvas, private lookupService : LookUpsService ,
    private userService : UsersService ,private loginService : LoginService  ,private  spinnerService:SpinnerService,
    private assignedTaskService : AssignedTasksService , private cacheService : CacheService<OpenTaskFilter> ) {
    }
    
    ngOnInit(): void {
    this.getData()
    this.getLookups();
  }

  getFilters() {
    this.columnFilters = {
      'Deadline': { isText: false, isDropdown: false, isDates: true, options: [] },
      'Project': { isText: false, isDropdown: true, isDates: false, options: this.transformedProjects },
      'Task Title': { isText: true, isDropdown: false, isDates: false, options: [] },
      'Creator': { isText: false, isDropdown: true, isDates: false, options: this.transformedUsers },
      'Assigned to': { isText: false, isDropdown: true, isDates: false, options: this.transformedUsers },
      'Completed%': { isText: true, isText2: true, isDropdown: false, isDates: false, options: [] },
      'Est. Hrs': { isText: false, isDropdown: false, isTime : true ,isDates: false, options: [] },
      'Act. Hrs': { isText: false, isDropdown: false, isTime : true ,isDates: false, options: [] },
      'Status': { isText: false, isDropdown: true, isDates: false, multiple : true ,options: [{ name: 'New', value: 1 },{ name: 'Active', value: 2 },{ name: 'Done', value: 3 },
        { name: 'Approved', value: 4 },{ name: 'Canceled', value: 5 },{ name: 'Reject', value: 6 }] },
      
    }
  }

  onFilterChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    console.log('Filters Applied:', this.filters);
  }

  filterData() {
    this.pagination.deadlineFrom = this.filters['Deadline_from'] ? this.filters['Deadline_from'] : null;
    this.pagination.deadlineTo = this.filters['Deadline_to'] ? this.filters['Deadline_to'] : null;
    this.pagination.projectId = this.filters['Project'] ? this.filters['Project'] : null;
    this.pagination.title = this.filters['Task Title'] ? this.filters['Task Title'] : null;
    this.pagination.creatorId = this.filters['Creator'] ? this.filters['Creator'] : null;
    this.pagination.assignedToId = this.filters['Assigned to'] ? this.filters['Assigned to'] : null;
    this.pagination.estimatedHoursFrom = this.filters['Est. Hrs_hoursFrom'] ? this.convertTime(this.filters['Est. Hrs_hoursFrom']) : null;
    this.pagination.estimatedHoursFrom = this.filters['Est. Hrs_hoursTo'] ? this.convertTime(this.filters['Est. Hrs_hoursTo']) : null;
    this.pagination.completionFrom = this.filters['Completed%'] ? this.filters['Completed%'] : null;
    this.pagination.completionTo = this.filters['Completed%_2'] ? this.filters['Completed%_2'] : null;
    this.pagination.statusIds = this.filters['Status'] ? this.filters['Status'] : [];
    this.cacheService.savePageState(this.componentName,this.pagination);
    this.getData()
  }

  convertTime = (time : string) : string =>{
    if(parseInt(time) < 10){
      return `0${time}:00`
    }else{
      return `${time}:00`
    }
  }

  getLookups() {
    forkJoin({
      projects: this.lookupService.getAllProjects(),
      users: this.userService.getEmployeesForViewer(),
    }).subscribe({
      next: ({ projects, users }) => {
        if (projects) {
          this.projects = projects;
          this.transformedProjects = this.projects.map(project => {
            return {
              name: project.name,
              value: (project.id) // Convert the 'id' string to a number for the 'value'
            };
          });
          this.getFilters()

        }
        if (users) {
          this.users = users;
          this.transformedUsers = this.users.map(user => {
            return {
              name: user.fullName,
              value: (user.id) // Convert the 'id' string to a number for the 'value'
            };
          });
          this.getFilters()
        }

        // Reset the pageSize after retrieving the data
        this.pagination.pageSize = 10;
      },
      error: (err) => {
        console.error('Error occurred while fetching data:', err);
        // Handle error scenarios
      },
    });
  }

  getData() {

    let cacheData = this.cacheService.getPageState(this.componentName);

    if(cacheData){
      this.pagination=cacheData;
    }
    let isAdmin = this.loginService.getUser().IsAdmin == 'True' ? true : false;
    if(!isAdmin){
      this.pagination.employeeId = this.loginService.getUser().sub;
    }

    this.spinnerService.show();
    
    this.assignedTaskService.getAllAssignmentEmployee(this.pagination).subscribe(res => {
      if (res) {
        this.spinnerService.hide();
        this.tableData =res.items;
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
        this.offcanvasService.dismiss();
      }
    })
  }

  displayColumns = (data: OpenTask) => {
    return [
      { isDate: true, text: data.maxDeliveryDate },
      { isText: true, text: data.projectName,width:'15%' },
      { isText: true, text: data.title },
      { isText: true, text: data.createdByName },
      { isText: true, text: data.assignedToName },
      { isTime: true, text: data.estimatedDuration.toString() },
      { isTime: true, text: data.actualDuration.toString() },
      { isStatus: true, number: data.assignmentStatusId },
      { isText: true, text: data.percentageCompleted.toString() + '%' },
    ];
  };

  nextPage(newPage: number) {
    this.pagination.pageNumber = newPage;
    this.cacheService.savePageState(this.componentName,this.pagination);

    this.getData();
  }

  openModal(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

}