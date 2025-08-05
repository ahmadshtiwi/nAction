import { Component, OnInit } from '@angular/core';
import { UsersService } from '../resource/users.service';
import { TaskScheduleService } from './task-schedule.service';
import { LoginService } from '../auth/login/login.service';
import { CacheService } from '../../shared/services/cache.service';
import { TaskScheduleRequest, TaskScheduleResponse } from './task-schedule.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-task-schedule',
  imports: [FormsModule, CommonModule, NgSelectModule,RouterModule],
  templateUrl: './task-schedule.html',
  styleUrl: './task-schedule.scss'
})
export class TaskSchedule  implements OnInit{

  users: { id: string; fullName: string; }[] = [];

  taskScheduleRequest:TaskScheduleRequest= new TaskScheduleRequest();
  taskScheduleResponse:TaskScheduleResponse[];
  taskScheduleResponseMatrex:  Record<string, Record<string, string>>;
  componentName:string='TaskSchedule';

  taskNames: string[] = [];
  dates: string[] = [];

  yesterdayFromat:string;

  isMissid:boolean=false;

  tableHeaders = ['Task Title', 'Date','Start Date','Deadline','Day Name','Est Duration','Duration','Completed','Is Missed']; 
  tableHeaderTitle="Task Schedule"


    constructor( private userService: UsersService,  private loginService : LoginService ,private router: Router, 
      private taskScheduleService:TaskScheduleService,private cacheService:CacheService<TaskScheduleRequest>){}

  ngOnInit(): void {

    if(this.cacheService.getPageState(this.componentName))
      {
        this.taskScheduleRequest=this.cacheService.getPageState(this.componentName);
        this.getData()
      }
      else
      {

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        this.yesterdayFromat =this.formatDate(yesterday);
    
    
        const fromDate = new Date(today.getFullYear(), today.getMonth(), 2);
        this.taskScheduleRequest.fromDate = this.formatDate(fromDate);
        this.taskScheduleRequest.toDate = this.formatDate(today);
        
        this.taskScheduleRequest.employeeId = this.loginService.getUser().sub ;
        this.getData();
      }

    this.userService.getEmployeesForViewer().subscribe(res => {
      if (res) {
        this.users = res;
      }
    });


  }
 
  getData()
  { 
    if(this.taskScheduleRequest.employeeId){

      this.cacheService.savePageState(this.componentName,this.taskScheduleRequest);
      this.taskScheduleService.getTaskSchduleMatrex(this.taskScheduleRequest).subscribe(res => {
        if (res) {
          this.taskScheduleResponseMatrex = res;
          this.taskNames = Object.keys(res);
          const firstTask = this.taskNames[0];
          this.dates = Object.keys(res[firstTask]);

          this.checkMissid();
        }
      });
    }
  }
  
  goToTasks(task){
  const [id, namePart] = task.split(" - ").map(part => part.trim());
  this.router.navigate(['/pages/tasks', id]);
 }

 checkMissid()
 {

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const[date,time]=this.dates[0].split('T');
const y=this.formatDate(yesterday);
  console.log(date);
  console.log(y);
console.log(date==y)
this.isMissid=y==date;
 }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  
  }


}
