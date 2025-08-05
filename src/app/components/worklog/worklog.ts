import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DefaultData, WorkLog, WorkLogFilter, WorkLogTask } from './worklog.model';
import { forkJoin } from 'rxjs';
import { NgbDropdownModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { ActivatedRoute } from '@angular/router';
import { AttachmentType } from '../../shared/models/enums';
import { LoginService } from '../auth/login/login.service';
import { UsersService } from '../resource/users.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { CacheService } from '../../shared/services/cache.service';
import { WorkLogService } from './worklog.service';
import { CommonModule, Location } from '@angular/common';
import { MaxValueDirective } from '../../shared/directives/max-value.directive';
import { AutoFormErrorDirective } from '../../shared/directives/auto-form-error.directive';
import { Table } from '../../shared/components/table/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Attachment } from '../../shared/components/attachment/attachment';
import { BadgesComponent } from "../../shared/components/badges/badges.component";

@Component({
  selector: 'app-worklog',
  standalone: true,
  imports: [Table, AutoFormErrorDirective, CommonModule, FormsModule, NgbDropdownModule, NgSelectModule, MaxValueDirective, Attachment, BadgesComponent],
  templateUrl: './worklog.html',
  styleUrl: './worklog.scss'
})
export class Worklog implements OnInit {
  componentName = "logComponent";
  @ViewChild('content') content!: TemplateRef<any>;
  tableHeaderTitle = 'Work Logs';
  tableHeaderButton = 'Add Item';
  tableHeadersDaily = ['Resource Name', 'Date', 'From', 'To', 'Project', 'Task Name', 'Description', 'Completed', 'Log'];
  tableHeadersTask = ['Resource Name', 'Date', 'From', 'To', 'Description', 'Completed', 'Actions'];
  columnFilters = {};
  tableData: WorkLog[] = [];
  workLog: WorkLog = new WorkLog();
  WorkLogTask: WorkLogTask = new WorkLogTask();
  pagination: WorkLogFilter = new WorkLogFilter();
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  id: string;
  empId: string;
  date: string;
  referenceId: number;
  filters: Record<string, any> = {};
  actionItems = [
    {
      viewAction: true,
      label: 'Edit',
      icon: 'bi-pencil',
      action: (item: any) => this.editItem(item),
    },
    {
      viewAction: true,
      label: 'Delete',
      icon: 'bi-trash',
      action: (item: any) => this.deleteItem(item),
    },
  ];
  today: string;
  viewValidation: boolean;
  users: { id: string; fullName: string; }[] = [];
  timeError: boolean;
  currentTime: string;
  attachmentType = AttachmentType;
  transformedUsers: { name: string; value: string; }[] = [];
  projects: { id: number, name: string, imageURL: string }[] = [];
  transformedProjects: {
    name: string; value: number; // Convert the 'id' string to a number for the 'value'
  }[];

  defaultData = new DefaultData();
  constructor(
    private offcanvasService: NgbOffcanvas, private loginService: LoginService,
    private lookupService: LookUpsService, private userService: UsersService,
    private WorkLogService: WorkLogService, private route: ActivatedRoute,
    private modalService: NgbModal, private spinnerService: SpinnerService,
    private location: Location, private cacheService: CacheService<WorkLogFilter>) {

  }

  ngOnInit(): void {
    const currentDate = new Date();
    const offset = currentDate.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    const localISOTime = new Date(currentDate.getTime() - offset).toISOString().split('T')[0];
    this.today = localISOTime;

    this.setCurrentTime();
    if (this.route.snapshot.paramMap.get('id')) { 
      this.id = this.route.snapshot.paramMap.get('id');
      this.getData();
      this.getDefaultData(this.today);

    } else {
      this.getEmployeeData();
      //this.getDefaultData(this.id)

    }



    this.getLookups()
  }

  getDefaultData(date: string) {
    if (!date) return;
    this.WorkLogService.getDefaultData(date).subscribe(res => {

      if (res) {
        
        this.defaultData = res;
        this.workLog.fromTime = this.defaultData.fromTime; //"08:00"
        this.workLog.toTime = this.defaultData.toTime;  //"17:00"

      }

    });

  }

  getFilters() {
    this.columnFilters = {
      'Resource Name': { isText: false, isDropdown: true, isDates: false, options: this.transformedUsers },
      'Date': { isText: false, isDropdown: false, isDates: true, options: [] },
      'Completed': { isText: true, isText2: true, isDropdown: false, isDates: false, options: [] },
      'Project': { isText: false, isDropdown: true, isDates: false, options: this.transformedProjects },
      'Task Name': { isText: true, isDropdown: false, isDates: false, options: this.transformedUsers },
      'Description': { isText: true, isDropdown: false, isDates: false, options: [] },
      'From': { isText: false, isDropdown: false, isDates: false, isTime: true, options: [] },
      'To': { isText: false, isDropdown: false, isDates: false, isTime: true, options: [] },
    }
  }

  onFilterChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    console.log('Filters Applied:', this.filters);
  }

  filterData() {
    this.pagination.filterEmployeeId = this.filters['Resource Name'] ? this.filters['Resource Name'] : null;
    this.pagination.description = this.filters['Description'] ? this.filters['Description'] : null;
    this.pagination.completionFrom = this.filters['Completed'] ? this.filters['Completed'] : null;
    this.pagination.completionTo = this.filters['Completed_2'] ? this.filters['Completed_2'] : null;
    this.pagination.dateFrom = this.filters['Date_from'] ? this.filters['Date_from'] : null;
    this.pagination.dateTo = this.filters['Date_to'] ? this.filters['Date_to'] : null;
    this.pagination.taskTitle = this.filters['Task Name'] ? this.filters['Task Name'] : null;
    this.pagination.projectId = this.filters['Project'] ? this.filters['Project'] : null;
    this.pagination.fromTimeFrom = this.filters['From_hoursFrom'] ? this.convertTime(this.filters['From_hoursFrom']) : null;
    this.pagination.fromTimeTo = this.filters['From_hoursTo'] ? this.convertTime(this.filters['From_hoursTo']) : null;
    this.pagination.toTimeFrom = this.filters['To_hoursFrom'] ? this.convertTime(this.filters['To_hoursFrom']) : null;
    this.pagination.toTimeTo = this.filters['To_hoursTo'] ? this.convertTime(this.filters['To_hoursTo']) : null;
    this.cacheService.savePageState(this.componentName, this.pagination);
    this.getEmployeeData()
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
        this.pagination.pageSize = 13;
      },
      error: (err) => {
        console.error('Error occurred while fetching data:', err);
        // Handle error scenarios
      },
    });
  }

  convertTime = (time: string): string => {
    
    return `${time.padStart(2, '0')}:00`;
  }
  goBack() {
    this.location.back()
  }

  validateDate() {
    if (this.workLog.date > this.today) {
      this.viewValidation = true;
      this.workLog.date = this.today; // Reset to today's date

    }
    this.validateTime();
  }

  getBatchId(id: any) {
    this.workLog.batchId = id + '8';
  }

  getData() {

    this.spinnerService.show();
    this.WorkLogService.getLogsByTaskID(this.id, this.pagination).subscribe(res => {
      if (res) { 
        this.tableData = res.workLogs.items;
        this.WorkLogTask = res;
        this.pagination.totalCount = res.workLogs.totalCount;
        this.pagination.totalPages = res.workLogs.totalPages;
      //  this.pagination.pageSize = res.workLogs.pageSize;
        this.pagination.pageNumber = res.workLogs.pageNumber;

  

        this.spinnerService.hide();
      }
    })
  }

  getEmployeeData() { 
    let isAdmin = this.loginService.getUser().IsAdmin == 'True' ? true : false;


    if (this.route.snapshot.paramMap.get("empId")) {
      this.pagination.filterEmployeeId = this.route.snapshot.paramMap.get("empId")
    }

    if (this.route.snapshot.paramMap.get("taskName")) {
      this.pagination.taskTitle = this.route.snapshot.paramMap.get("taskName")
    }
    if (this.route.snapshot.paramMap.get("projectId")) {
      this.pagination.projectId = parseInt(this.route.snapshot.paramMap.get("projectId"))
    }

    if (this.route.snapshot.paramMap.get("date")) {
      this.pagination.dateFrom = this.route.snapshot.paramMap.get("date")
      this.pagination.dateTo = this.route.snapshot.paramMap.get("date")
    }

    if (this.route.snapshot.paramMap.get("fromDate")) {
      this.pagination.dateFrom = this.route.snapshot.paramMap.get("fromDate")
    }
    if (this.route.snapshot.paramMap.get("toDate")) {
      this.pagination.dateTo = this.route.snapshot.paramMap.get("toDate")
    }

    let cacheData = this.cacheService.getPageState(this.componentName);

    if (cacheData) {
      this.pagination = cacheData;
    }
    if (!isAdmin) {
      this.pagination.employeeId = this.loginService.getUser().sub;
    }
    this.spinnerService.show();
    this.WorkLogService.getAllWorkLogs(this.pagination).subscribe(res => {
      if (res) {
        this.tableData = res.items;
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
        this.offcanvasService.dismiss();
        this.spinnerService.hide();

      }
    })
  }

  workLogColumns = (data: WorkLog) => {
    return [
      { isText: true, text: data.employeeName },
      { isDate: true, text: data.date, },
      { isText: true, text: data.fromTime },
      { isText: true, text: data.toTime },
      { isText: true, text: data.description },
      { isText: true, text: data.percentageCompleted.toString() + ' %' },
    ];
  };
  hourlyBreakDownColumns = (data: WorkLog) => {
    return [
      { isText: true, text: data.employeeName, width: '12%' },
      { isDate: true, text: data.date, width: '10%' },
      { isText: true, text: data.fromTime, width: '3%' },
      { isText: true, text: data.toTime, width: '3%' },
      { isText: true, text: data.projectCode, width: '5%' },
      { isText: true, text: data.assignmentTitle, width: '15%' },
      { isText: true, text: data.description },
      { isText: true, text: data.percentageCompleted.toString() + ' %' },
    ];
  };

  setCurrentTime() {
    const now = new Date();
    this.currentTime = this.formatTime(now);
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  // validateTime() { debugger
  //   const currentDate = new Date();
  //   this.today = currentDate.toISOString().split('T')[0];

  //   if (this.workLog.date < this.today) {
  //     this.timeError = this.workLog.toTime < this.workLog.fromTime;
  //     // this.timeError = false
  //     return
  //   }

  //   if (this.workLog.toTime && this.workLog.fromTime) {
  //     let fromTime = this.workLog.fromTime.substring(0,5);
  //     let toTime = this.workLog.toTime.substring(0,5);
  //     this.setCurrentTime();
  //     this.timeError = toTime < fromTime || toTime > this.currentTime.substring(0,5);
  //   } else {
  //     this.timeError = false;
  //   }
  
  // }

  validateTime() {
  const currentDate = new Date();
  this.today = currentDate.toISOString().split('T')[0];

  const fromTime = this.workLog.fromTime;
  const toTime = this.workLog.toTime;

  if (this.workLog.date < this.today) {
    this.timeError = this.toMinutes(toTime) < this.toMinutes(fromTime);
    return;
  }

  if (fromTime && toTime) {
    this.setCurrentTime(); // لازم ترجّع this.currentTime بصيغة hh:mm أو hh:mm:ss

    this.timeError = 
      this.toMinutes(toTime) < this.toMinutes(fromTime) ||
      this.toMinutes(toTime) > this.toMinutes(this.currentTime);
  } else {
    this.timeError = false;
  }
}


  toMinutes(time: string): number {
  if (!time) return 0;

  const parts = time.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  return hours * 60 + minutes;
}

  editItem(item: WorkLog): void {
    this.isView = false;
    this.isAdd = false;
    this.WorkLogService.getWorkLogsByID(item.workLogId).subscribe(res => {
      if (res) {
        this.workLog = res;
        this.referenceId = (res.workLogId)
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }


  deleteItem(item: any): void {
    const modalRef = this.modalService.open(ModalComponent, {
      windowClass: 'custom-modal-center',
      modalDialogClass: 'custom-modal-content custom-modal-size'
    });
    modalRef.componentInstance.message = 'Are you sure you want to delete this record ? ';
    modalRef.componentInstance.isDeleteAction = true;
    modalRef.result.then((res: boolean) => {
      if (res) {
        this.WorkLogService.deleteWorkLogs(item.workLogId).subscribe(res => { this.getData() })
      }
    }
    )
  }

  viewDetails(item: WorkLog): void {
    this.isView = true;
    this.WorkLogService.getWorkLogsByID(item.workLogId).subscribe(res => {
      if (res) {
        this.workLog = res;
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

  nextPage(newPage: number) { 
    console.log('Page changed to:', newPage);
    this.pagination.pageNumber = newPage;
    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getData()
    } else {
      this.cacheService.savePageState(this.componentName, this.pagination);
      this.getEmployeeData()
    }
  }

  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isView = isView;
    this.workLog = new WorkLog();
    // add defult date

    this.getDefaultData(this.today)
    this.workLog.date = this.today;
    this.workLog.description = this.WorkLogTask.title;
    this.workLog.fromTime = this.defaultData.fromTime; //"08:00"
    this.workLog.toTime = this.defaultData.toTime;  //"17:00"

    this.workLog.percentageCompleted = parseInt(this.WorkLogTask.percentageCompleted);
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest(workLogsForm: NgForm) {

    this.validateTime();

    if (workLogsForm.invalid) {
      return
    }
    if (this.timeError) {
      return
    }
    this.workLog.fromTime = this.ensureValidTimeFormat(this.workLog.fromTime);
    this.workLog.toTime = this.ensureValidTimeFormat(this.workLog.toTime);
    this.spinnerService.show();
    this.workLog.assignmentId = parseInt(this.id);
    if (this.isAdd) {
      this.WorkLogService.addWorkLogs(this.workLog).subscribe(res => {

        if (res) {
          this.offcanvasService.dismiss();
          if (this.route.snapshot.paramMap.get('id')) {
            this.id = this.route.snapshot.paramMap.get('id');
            this.getData();
          } else {
            this.getEmployeeData();
          }
        } else {

        }
      })
    } else if (this.isView) {

      this.isView = true;

    } else {
      this.WorkLogService.updateWorkLogs(this.workLog).subscribe(res => {
        if (res) {

          this.offcanvasService.dismiss();
          if (this.route.snapshot.paramMap.get('id')) {
            this.id = this.route.snapshot.paramMap.get('id');
            this.getData()
          } else {
            this.getEmployeeData()
          }
        }
      })
    }

    console.log('Timeout started...');
    setTimeout(() => {
      this.spinnerService.hide();
    }, 3000); // 3 seconds delay
  }

  ensureValidTimeFormat(time: string): string {
    if (!time) return "00:00:00";
    if (time.length === 5) return time + ":00";
    return time;
  }
}