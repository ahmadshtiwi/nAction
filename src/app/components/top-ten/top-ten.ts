import { Component, OnInit } from '@angular/core';
import { TopResponse, TopTenReq } from './top-ten.model';
import { TopTenService } from './top-ten.service';
import { LoginService } from '../auth/login/login.service';
import { Table } from "../../shared/components/table/table";
import { SpinnerService } from '../../shared/services/spinner.service';


@Component({
  selector: 'app-top-ten',
  imports: [Table],
  templateUrl: './top-ten.html',
  styleUrl: './top-ten.scss'
})
export class TopTen implements OnInit {

  topTenReq: TopTenReq = new TopTenReq();
  tableHeaders = ["Resource", "KPI", "Office Days", "Office Hours", "Actual Hours", "Productivity", "Efficiency", "Performance Score", "Deadline Score"];
  tableHeaderTitle = "Top 10";
  employees: TopResponse[] = []; // Empty array for storing employee data
  selectedColumn: string = 'KPI';
  sortColumn: string = 'kpi';
  sortDirection: 'asc' | 'desc' = 'desc';


  constructor(private topTenService: TopTenService, public loginService: LoginService, private spinnerService:SpinnerService) { }

  ngOnInit(): void {
    const today = new Date();

    // تحديد بداية الشهر الحالي
    const fromDate = new Date(today.getFullYear(), today.getMonth(), 2);

    // تحويل التاريخ إلى الصيغة المطلوبة
    this.topTenReq.employeeId = this.loginService.getUser().sub;
    this.topTenReq.fromDate = this.formatDate(fromDate);
    this.topTenReq.toDate = this.formatDate(today);
    this.getTopTenData();
    // this.sortedList = [...this.employees];

  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];

  }

  handleOrderByChange(value: string) {
    if (!value) {
      this.sortBy('KPI');
      this.employees = this.sortedEmployees();
    }
    else {

      this.sortBy(value);
      this.employees = this.sortedEmployees();
    }
  }
  handleToDateChange(value: string) {
    this.topTenReq.toDate = value;
    this.getTopTenData();
  }
  handleFromDateChange(value: string) {
    this.topTenReq.fromDate = value;
        this.getTopTenData();

  }

  topTenColumns = (data: TopResponse) => {
    return [
      { isMony: true, text: data.fullName },
      { isMony: true, text: data.kpi.toString() },
      { isMony: true, text: data.officialDays.toString() },
      { isMony: true, text: data.officialHours.toString() },
      { isMony: true, text: data.actualHours.toString() },
      { isMony: true, text: data.productivity.toString()+' %'},
      { isMony: true, text: this.roundToOneDecimal(data.efficiency).toString()+ ' %',isEfficiency:true},
      { isMony: true, text: data.performanceScore.toString()+' %' },
      { isMony: true, text: data.averageDeadlineScore.toString() },

    ];
  };

  roundToOneDecimal(value) :number {
  if (typeof value === 'string') {
    value = value.replace(/,/g, '').trim();
    value = parseFloat(value);
  }

  if (isNaN(value)) return 0;

  return Math.round(value * 10) / 10;
}

  getTopTenData() {

    this.spinnerService.show();
    this.topTenService.getTopTen(this.topTenReq).subscribe(res => {
      if (res) {

        this.employees = res;
        this.spinnerService.hide();
      }
    });

  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
  }

sortedEmployees() {
  if (!this.sortColumn) {
    return this.employees;
  }

  return [...this.employees].sort((a, b) => {
    const col = this.mapHeaderToKey(this.sortColumn);

    let valueA = a[col];
    let valueB = b[col];

    const timeColumns = ['actualHours']; // أضف الأعمدة التي تحتوي وقت

    const isTimeString = (val: any) =>
      typeof val === 'string' && /^(\d*):(\d{2})$/.test(val);

    const parseToMinutes = (str: any): number => {
      if (!str || typeof str !== 'string') return 0;

      const match = str.match(/^(\d*):(\d{2})$/);
      if (!match) return 0;

      const hours = match[1] ? parseInt(match[1], 10) : 0;
      const minutes = parseInt(match[2], 10);
      return (isNaN(hours) ? 0 : hours * 60) + (isNaN(minutes) ? 0 : minutes);
    };

    if (timeColumns.includes(col)) {
      valueA = parseToMinutes(valueA);
      valueB = parseToMinutes(valueB);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return this.sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
    }

    return this.sortDirection === 'desc'
      ? ('' + valueA).localeCompare('' + valueB)
      : ('' + valueB).localeCompare('' + valueA);
  });
}

  mapHeaderToKey(header: string): string {
    const map: { [key: string]: string } = {
      'Resource': 'fullName',
      'KPI': 'kpi',
      'Office Days': 'officialDays',
      'Office Hours': 'officialHours',
      'Actual Hours': 'actualHours',
      'Productivity': 'productivity',
      'Efficiency': 'efficiency',
      'Performance Score': 'performanceScore',
      'Deadline Score': 'averageDeadlineScore'
    };
    return map[header] || header;
  }
}
