import { ActionItem, Table } from "../../shared/components/table/table";
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbOffcanvas, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import { RejectModel, Tasks, TasksFilter } from './task.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { MaxValueDirective } from '../../shared/directives/max-value.directive';
import { SpinnerService } from '../../shared/services/spinner.service';
import { CommonModule } from '@angular/common';
import { AttachmentType, StatusEnum } from "../../shared/models/enums";
import { TasksService } from "./tasks.service";
import { LoginService } from "../auth/login/login.service";
import { LookUpsService } from "../../shared/services/look-ups.service";
import { CacheService } from "../../shared/services/cache.service";
import { UsersService } from "../resource/users.service";
import { ModalComponent } from "../../shared/components/modal/modal.component";
import { Attachment } from "../../shared/components/attachment/attachment";
import { AutoFormErrorDirective } from "../../shared/directives/auto-form-error.directive";
@Component({
  selector: 'app-task',
  imports: [Table, FormsModule, CommonModule, NgSelectModule, MaxValueDirective, Attachment,AutoFormErrorDirective,NgbTimepickerModule,NgbDropdownModule],

  templateUrl: './task.html',
  styleUrl: './task.scss'
})
export class Task {
  
  hours: number=0;
  minutes: number=0;

  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('reject') rejectDialog!: TemplateRef<any>;
  componentName ='TaskComponent';
  tableHeaderTitle = 'Tasks List';
  tableHeaderButton = 'Add Item';
  tableHeaders = ['Code', 'Title', 'Creation Date', 'Creator', 'Est. Hrs', 'Act. Hrs', 'Deadline', 'Assigned To', 'Status','Completion', 'Actions', 'Log'];
  tableData: Tasks[] = [];
  task: Tasks = new Tasks();
  pagination: TasksFilter = new TasksFilter();
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  statuses: { name: string }[] = [];
  statusEnum = StatusEnum;
  actionItems: ActionItem<any>[] = [];
  users: { id: string, fullName: string }[] = [];
  isEdit: boolean;
  employees: { id: string; fullName: string; }[] = [];
  projects: {id : number , name : string , imageURL : string}[] = [];
  attachmentType = AttachmentType.Assignment;
  rejectModel: RejectModel = new RejectModel();

  messagePer:string|null;
  isValidPer:boolean=true;
  todayDate: string;
  
  filters: Record<string, any> = {};
  transformedProjects: { name: string; value: number; }[] = [];
  columnFilters = {};
  transformedUsers: {name: string; value: string; }[] = [];
  isFlixableDisable:boolean=false;
  constructor(
    private offcanvasService: NgbOffcanvas,
    private taskService: TasksService, private spinnerService: SpinnerService,
    private loginService: LoginService, private lookupService: LookUpsService, 
    private userService: UsersService, private modalService: NgbModal,
    private cacheService: CacheService<TasksFilter>
  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.getLookups();
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0]; // تحويل التاريخ إلى yyyy-mm-dd
  }
  getFilters() {
    this.columnFilters = {
      'Code': { isText: false, isDropdown: true, isDates: false, options: this.transformedProjects },
      'Title': { isText: true, isDropdown: false, isDates: false, options: [] },
      'Assigned To': { isText: false, isDropdown: true, isDates: false, options: this.transformedUsers },
      'Creator': { isText: false, isDropdown: true, isDates: false, options: this.transformedUsers },
      'Status': { isText: false, isDropdown: true, isDates: false, multiple : true ,options: [{ name: 'New', value: 1 },{ name: 'Active', value: 2 },{ name: 'Done', value: 3 },{ name: 'Approved', value: 4 },{ name: 'Canceled', value: 5 },{ name: 'Reject', value: 6 }] },
      'Creation Date': { isText: false, isDropdown: false, isDates: true, options: [] },
      'Deadline': { isText: false, isDropdown: false, isDates: true, options: [] },
      'Est. Hrs': { isText: false, isDropdown: false, isTime : true ,isDates: false, options: [] },
      'Act. Hrs': { isText: false, isDropdown: false, isTime : true ,isDates: false, options: [] },
    }
  }

  getActions(tasks: Tasks) {
    this.actionItems = [
      {
        viewAction: (tasks.assignmentStatusId == this.statusEnum.Completed || tasks.assignmentStatusId == this.statusEnum.Active || tasks.assignmentStatusId == this.statusEnum.New),
        label: 'Edit',
        icon: 'bi-pencil',
        action: (item: any) => this.editItem(item),
      },
      {
        viewAction: !(tasks.assignmentStatusId == this.statusEnum.Completed || tasks.assignmentStatusId == this.statusEnum.Active || tasks.assignmentStatusId == this.statusEnum.New),
        label: 'No Actions',
        icon: 'bi-pencil',
        action: () => { },
      },
      {
        viewAction: (tasks.assignmentStatusId == this.statusEnum.New),
        label: 'Delete',
        icon: 'bi-trash',
        action: (item: any) => this.deleteItem(item),
      },
      {
        viewAction: (tasks.assignmentStatusId == this.statusEnum.Completed && tasks.createdById == this.loginService.getUser().sub),
        label: 'Approve',
        icon: 'bi-check-circle-fill text-success',
        action: (item: any) => this.approveOrCancel(item, this.statusEnum.ApprovedCompleted),
      },
      {
        viewAction: (tasks.createdById == this.loginService.getUser().sub),
        label: 'Cancel',
        icon: 'bi-dash-circle-fill text-danger ',
        action: (item: any) => this.approveOrCancel(item, this.statusEnum.Canceled),
      },
      {
        viewAction: (tasks.assignmentStatusId == this.statusEnum.Completed && tasks.createdById == this.loginService.getUser().sub),
        label: 'Reject',
        icon: 'bi-x-circle-fill text-danger ',
        action: (item: any) => this.Reject(item, this.statusEnum.Reject),
      },
    ];
  }

  approveOrCancel(item: Tasks, ApprovedOrCanceled: StatusEnum): void {
    this.taskService.updateStatus(item.id, ApprovedOrCanceled).subscribe(res => {
      if (res) {
        this.getData();
      }
    })
  }

  Reject(item: Tasks, ApprovedOrCanceled: StatusEnum): void {
    this.rejectModel.Id = item.id;
    this.rejectModel.NewStatusId = ApprovedOrCanceled;
    this.rejectModel.compleation = 99;
    this.isView = false;
    this.offcanvasService.open(this.rejectDialog, { position: 'end', panelClass: 'custom-offcanvas' });
  }
  submitReject(form: NgForm) {
    
    if (form.invalid || !this.isValidPer) {
      return
    }
    this.spinnerService.show()

    this.taskService.updateStatusReject(this.rejectModel).subscribe(res => {
      if (res) {
        this.spinnerService.hide();
        this.offcanvasService.dismiss();
        this.getData();
      }
    })
  }

  getUserReports (projectId : number){

        this.users=null;
    this.task.assignedToId=null;
    if(!projectId) return;

      this.lookupService.getUsersByProjectId(projectId).subscribe(res=>{
        if(res){
          this.users = res;
          this.transformedUsers = this.users.map(user => {
            return {
              name: user.fullName,
              value: (user.id) // Convert the 'id' string to a number for the 'value'
            };
          });
          this.getFilters()
        }
      })
    
  }

  getLookups() {
    this.lookupService.getAllProjectsForTasks().subscribe(res =>{
      if(res){
        this.projects = res;
          this.transformedProjects = this.projects.map(project => {
            return {
              name: project.name,
              value: (project.id) // Convert the 'id' string to a number for the 'value'
            };
          });
          this.getFilters()
      }
    })

    this.userService.getEmployeesForViewer().subscribe(res =>{
      if(res){
        this.users = res;
        this.transformedUsers = this.users.map(user => {
          return {
            name: user.fullName,
            value: (user.id) // Convert the 'id' string to a number for the 'value'
          };
        });
      }
    })
  }

  checkHours(hour: number) {
    if (hour > 9999) {
      this.hours = 9999;
    }
  }

  checkMinutes(minutes: number) {
    if (minutes > 59) {
      this.minutes = 59
    }
  }

  getData() {
    this.spinnerService.show();
    
    let cacheData = this.cacheService.getPageState(this.componentName);

    if(cacheData){
      this.pagination=cacheData;
    }
    this.taskService.getAllTasks(this.pagination).subscribe(res => {
      if (res) {
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
        this.tableData = res.items;
        this.spinnerService.hide()
      }
    })
  }

  filterData() {
    this.pagination.Title = this.filters['Title'] ? this.filters['Title'] : null;
    this.pagination.CreationDateFrom = this.filters['Creation Date_from'] ? this.filters['Creation Date_from'] : null;
    this.pagination.CreationDateTo = this.filters['Creation Date_to'] ? this.filters['Creation Date_to'] : null;
    this.pagination.DeadlineFrom = this.filters['Deadline_from'] ? this.filters['Deadline_from'] : null;
    this.pagination.DeadlineTo = this.filters['Deadline_to'] ? this.filters['Deadline_to'] : null;
    this.pagination.ProjectId = this.filters['Code'] ? this.filters['Code'] : null;
    this.pagination.AssignedToId = this.filters['Assigned To'] ? this.filters['Assigned To'] : null;
    this.pagination.CreatorId = this.filters['Creator'] ? this.filters['Creator'] : null;
    this.pagination.EstimatedHoursFrom = this.filters['Est. Hrs_hoursFrom'] ? this.convertTime(this.filters['Est. Hrs_hoursFrom']) : null;
    this.pagination.EstimatedHoursTo = this.filters['Est. Hrs_hoursTo'] ? this.convertTime(this.filters['Est. Hrs_hoursTo']) : null;
    this.pagination.ActualHoursFrom = this.filters['Act. Hrs_hoursFrom'] ? this.convertTime(this.filters['Act. Hrs_hoursFrom']) : null;
    this.pagination.ActualHoursTo = this.filters['Act. Hrs_hoursTo'] ? this.convertTime(this.filters['Act. Hrs_hoursTo']) : null;
    this.pagination.StatusIds = this.filters['Status'] ? this.filters['Status'] : [];
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

  displayColumns = (data: Tasks) => {
    return [
      { isText: true, text: data.projectCode },
      { isText: true, text: data.id + ' - ' + data.title },
      { isDate: true, text: data.createdOn },
      { isText: true, text: data.createdByName },
      { isText: true, text: data.estimatedDuration.toString() },
      { isText: true, text: data.actualDuration.toString() },
      { isDate: true, text: data.maxDeliveryDate },
      { isText: true, text: data.assignedToName },
      { isStatus: true, number: data.assignmentStatusId },
      { isText: true, text: data.percentageCompleted.toString()+'%' },
    ];
  };

  getBatchId(id: any) {
    this.task.batchId = id + '8';
  }

  editItem(item: Tasks): void { debugger
    this.task = new Tasks();
    this.isView = false;
    this.isAdd = false;
    this.isEdit = true;
    this.getUserReports(item.projectId);
    this.taskService.getTaskByID(item.id).subscribe(res => {
      if (res) { debugger
        this.task = res;
        this.hours = parseInt((res.estimatedDuration.split(':'))[0])
        this.minutes = parseInt((res.estimatedDuration.split(':'))[1])
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
        this.taskService.deleteTask(item.id).subscribe(res => {
          if (res) {
            this.getData()
          }
        })
      }
    })
  }

  checkPer() {
    let per = this.rejectModel.compleation;
    if (per > 99 || per < 0) {
      this.messagePer = "The Value Must Be between 0 and 99";
      this.isValidPer = false;
    }
    else {
      this.messagePer = null;
      this.isValidPer = true;
    }
  }

  viewDetails(item: Tasks): void {
    this.isView = true;
    this.task = new Tasks();
    this.taskService.getTaskByID(item.id).subscribe(res => {
      if (res) {
        this.task = res;
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

  nextPage(newPage: number) {
    console.log('Page changed to:', newPage);
    this.pagination.pageNumber = newPage;
    this.cacheService.savePageState(this.componentName,this.pagination);
    this.getData();
  }

  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = false;
    this.isAdd = isAdd;
    this.isView = isView;
    this.task = new Tasks();
    const today = new Date();
    this.task.startDate= today.toISOString().split('T')[0];
    this.hours = 0;
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }
  openFilter(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isView = isView;
    this.task = new Tasks();
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest(form: NgForm) {

     const currentUserId= this.loginService.getUser().sub;
    
     if(currentUserId==this.task.assignedToId)
    {
      this.task.flexibleDeadLine=true;
      this.task.flexibleDuration=true;
    }
    this.checkStartDate()
    if (form.invalid|| !this.isValidPer) {
      return
    }
    this.checkStartDate();
    this.spinnerService.show()
    this.checkTimeFormat();

    if (this.isAdd) {
      this.taskService.addTask(this.task).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else if (this.isEdit) {
      this.taskService.updateTask(this.task).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else {
      this.isView = true;
    }
  }
  checkStartDate() {
    if (this.task.startDate > this.task.maxDeliveryDate) {
      this.messagePer = "Start Date must be less than or equal to the Max Deadline.";
      this.isValidPer = false;
    } else {
      this.messagePer = null;
      this.isValidPer = true;
    }
  }

  checkTimeFormat() {
    let hour: string;
    let minute: string;
    if (this.minutes < 10) {
      minute = `0${this.minutes}`;
    } else {
      minute = this.minutes.toString();
    }

    if (this.hours < 10) {
      hour = `0${this.hours}`;
    } else {
      hour = this.hours.toString();
    }

    this.task.estimatedDuration = `${hour}:${minute}`;
  }

  onFilterChange(filters: Record<string, any>) {
    this.filters = { ...filters };
    console.log('Filters Applied:', this.filters);
  }

  flixableChange(){
    const currentUserId= this.loginService.getUser().sub;
    if(currentUserId==this.task.assignedToId)
    {
      this.task.flexibleDeadLine=true;
      this.task.flexibleDuration=true;
      this.isFlixableDisable=true;
    }
    else{
      this.isFlixableDisable=false;

    }
  }
}