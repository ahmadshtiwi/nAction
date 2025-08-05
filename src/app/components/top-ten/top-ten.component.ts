import { Component, OnInit } from '@angular/core';
import { TopTenReq, TopResponse } from './top-ten.modal';
import { FormsModule } from '@angular/forms';
import { TopTenService } from './top-ten.service';
import { LoginService } from '../authorization/login/login.service';

@Component({
  selector: 'app-top-ten',
  imports: [FormsModule],
  templateUrl: './top-ten.component.html',
  styleUrl: './top-ten.component.scss'
})
export class TopTenComponent implements OnInit {

  topTenReq: TopTenReq= new TopTenReq();
  tableHeaders=["Resource" ,"KPI","Office Days","Office Hours","Actual hours","Productivity","Efficiency","Performance Score","Deadline score"];
  tableHeaderTitle="Top 10";
  employees: TopResponse[] = []; // Empty array for storing employee data

  constructor(private topTenService:TopTenService , public loginService: LoginService){}

  ngOnInit(): void {
    const today = new Date();

    // تحديد بداية الشهر الحالي
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 2);
    
    // تحويل التاريخ إلى الصيغة المطلوبة
    this.topTenReq.employeeId= this.loginService.getUser().sub;
    this.topTenReq.fromDate = this.formatDate(fromDate);
    this.topTenReq.toDate = this.formatDate(today); 
    this.getTopTenData();
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
      }
    });

  }

  selectedColumn: string = 'KPI';

  sortColumn: string = 'kpi';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  sortBy(column: string) {
      if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
      }
  }
  
  sortedEmployees() {
      if (!this.sortColumn) {
          return this.employees;
      }
  
      return [...this.employees].sort((a, b) => {
          const col = this.mapHeaderToKey(this.sortColumn);
  
          const valueA = a[col];
          const valueB = b[col];
  
          if (typeof valueA === 'number' && typeof valueB === 'number') {
              return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          } else {
              return this.sortDirection === 'asc' 
                  ? ('' + valueA).localeCompare('' + valueB)
                  : ('' + valueB).localeCompare('' + valueA);
          }
      });
  }

  mapHeaderToKey(header: string): string {
    const map: { [key: string]: string } = {
        'Resource': 'fullName',
        'KPI': 'kpi',
        'Office Days': 'officialDays',
        'Office Hours': 'officialHours',
        'Actual hours': 'actualHours',
        'Productivity': 'productivity',
        'Efficiency': 'efficiency',
        'Performance Score': 'performanceScore',
        'Deadline score': 'averageDeadlineScore'
    };
    return map[header] || header;
  }
}
