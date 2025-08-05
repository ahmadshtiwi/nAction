import { Component, OnInit } from '@angular/core';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LoginService } from '../auth/login/login.service';
import { UsersService } from '../resource/users.service';
import { AllocationTableResponse } from '../settings/resource-allocation/resource-allocation.model';
import { ResourceAllocationService } from '../settings/resource-allocation/resource-allocation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allocation',
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './allocation.html',
  styleUrl: './allocation.scss'
})
export class Allocation implements OnInit {
  allocationTable?: AllocationTableResponse;
  allocationTableProject?: AllocationTableResponse;
  userId: string;
  currentUserId: string;
  projectId: number;
  users: { id: string; fullName: string; }[] = [];
  projects: { id: number, name: string, imageURL: string }[] = [];

  date: Date = new Date(); // تبدأ من اليوم
  minDate?: Date;
  maxDate?: Date;
  canGoNext = true;
  canGoPrev = true;
  
  dateProject: Date = new Date(); // تبدأ من اليوم
  minDateProject?: Date;
  maxDateProject?: Date;
  canGoNextProject = true;
  canGoPrevProject = true;

  constructor(
    private resourceService: ResourceAllocationService,
    private loginService: LoginService,
    private lookupService:LookUpsService,
    private userService: UsersService,
    private spinnerService:SpinnerService
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.getUser().sub;
    this.currentUserId=this.loginService.getUser().sub;
    this.getLookups();
    this.getData();

    // this.userService.getEmployeesForViewer().subscribe(res => {
    //   if (res) {
    //     this.users = res;
    //   }
    // });
  }

  getProjectData(){
      const formattedDate = this.dateProject.toISOString().split('T')[0]; // yyyy-MM-dd
    this.spinnerService.show();
    this.resourceService.GetAllocatioTableByProject(this.projectId, formattedDate)
      .subscribe(res => {
        if (res) {
          this.allocationTableProject = res;

          this.minDateProject = new Date(res.minDate);
          this.maxDateProject = new Date(res.maxDate);

          this.canGoPrevProject = this.dateProject > this.minDateProject;
          this.canGoNextProject = this.dateProject < this.maxDateProject;
        }
        this.spinnerService.hide();
      });

  }
  getData() {
    if(!this.userId) return;
    const formattedDate = this.date.toISOString().split('T')[0]; // yyyy-MM-dd
    this.spinnerService.show();
    this.resourceService.getAllocatioTableByUser(this.userId, formattedDate)
      .subscribe(res => {
        if (res) {
          this.allocationTable = res;

          this.minDate = new Date(res.minDate);
          this.maxDate = new Date(res.maxDate);

          this.canGoPrev = this.date > this.minDate;
          this.canGoNext = this.date < this.maxDate;
        }
        this.spinnerService.hide();
      });


  }
  getLookups() {
    this.lookupService.getAllProjects(this.userId).subscribe(res => {
      if (res) {
        this.projects = res;
        // this.transformedProjects = this.projects.map(project => {
        //   return {
        //     name: project.name,
        //     value: (project.id) // Convert the 'id' string to a number for the 'value'
        //   };
        // });
       // this.getFilters()
      }
    })

    this.userService.getEmployeesForViewer().subscribe(res => {
      if (res) {
        this.users = res;
        // this.transformedUsers = this.users.map(user => {
        //   return {
        //     name: user.fullName,
        //     value: (user.id) // Convert the 'id' string to a number for the 'value'
        //   };
        // });
      }
    })
  }
  change(days: number) {
    const newDate = new Date(this.date);
    newDate.setDate(this.date.getDate() + days);

    if (this.minDate && newDate < this.minDate) 
      {
        this.canGoPrev=false;
        return;
      }
    if (this.maxDate && newDate > this.maxDate){
    this.canGoNext=false;

      return;
    } 

    this.date = newDate;
    this.getData();
  }
  changeProject(days: number) {
    const newDate = new Date(this.dateProject);
    newDate.setDate(this.dateProject.getDate() + days);

    if (this.minDateProject && newDate < this.minDateProject) 
      {
        this.canGoPrevProject=false;
        return;
      }
    if (this.maxDateProject && newDate > this.maxDateProject){
    this.canGoNextProject=false;

      return;
    } 

    this.dateProject = newDate;
    this.getProjectData();
  }

  goToToday() {
    this.date = new Date();
    this.getData();
  }

  goToTodayProject() {
    this.dateProject = new Date();
    this.getProjectData();
  }
}
