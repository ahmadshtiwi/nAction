import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { ProjectCost, ProjectCostPagination, ProjectCostSummary } from './project-cost.model';
import { PerformanceService } from '../performance/performance.service';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { ColumnData, Table } from '../../shared/components/table/table';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ProjectCostService } from './project-cost.service';
import { ProjectService } from '../project/project.service';

@Component({
  selector: 'app-project-cost',
  imports: [Table,NgbCarouselModule,FormsModule],
  templateUrl: './project-cost.html',
  styleUrl: './project-cost.scss'
})
export class ProjectCostComponent implements OnInit {

  pagination: ProjectCostPagination = new ProjectCostPagination();
  tableHeaders: string[] = ['Resource', 'Hours' ,'Hours %age', 'Cost', 'Cost %age'];
  projectCostData: ProjectCost[] = [];
  projectCostSummary : ProjectCostSummary = new ProjectCostSummary();
  sortDirection: 'asc' | 'desc' = 'desc';
   sortColumn: string = 'employee';



  constructor(private projectCostService: ProjectCostService ,private lookupService : LookUpsService) { }

  products: WritableSignal<{id : number , name : string , imageURL : string}[]> = signal([]);

  productChunks = computed(() => {
    let chunks: {id : number , name : string , imageURL : string}[][] = [];
    let tempChunk: {id : number , name : string , imageURL : string}[] = [];

    this.products().forEach((product, index) => {
      tempChunk.push(product);

      if (tempChunk.length === 6 || index === this.products().length - 1) {
        chunks.push([...tempChunk]);
        tempChunk = [];
      }
    });

    return chunks;
  });

  ngOnInit(): void {
    this.getProjects()
  }

  getProjectCost(projectId: number) { debugger
    this.pagination.projectId = projectId;
    this.projectCostService.getProjectCost(this.pagination).subscribe(res =>{
      if(res){
        this.projectCostData = res.items;
        this.projectCostSummary = res.summary;
        this.pagination.pageNumber = res.pageNumber;
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
      }
    })
  }

  getProjects(): void {    
    this.lookupService.getAllProjectsForCost().subscribe(res=>{
      if(res){
        this.products.set(res);
      }
    })
  }

    displayColumns = (data: ProjectCost) : ColumnData[] => {
      return [
        { isText: true, text: data.employee },
        { isText: true, text: data.hours },
        { isText: true, text: data.hoursPercentage.toString() + '%' },
        { isMony: true, text: data.cost },
        { isText: true, text: data.costPercentage + '%' },
      ];
    };

    nextPage(newPage: number) {
      console.log('Page changed to:', newPage);
      this.pagination.pageNumber = newPage;
      this.getProjectCost(this.pagination.projectId);
    }
      handleOrderByChange(value: string) {
    if (!value) {
      this.sortBy('KPI');
      this.projectCostData = this.sortedProjectCostData();
    }
    else {

      this.sortBy(value);
      this.projectCostData = this.sortedProjectCostData();
    }
  }
  handleToDateChange(value: string) { debugger
    this.pagination.toDate = value;
    this.getProjectCost(this.pagination.projectId);
  }
  handleFromDateChange(value: string) {
    this.pagination.fromDate = value;
        this.getProjectCost(this.pagination.projectId);

  }

      sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc'
    }
  }
sortedProjectCostData() {
  if (!this.sortColumn) {
    return this.projectCostData;
  }

  return [...this.projectCostData].sort((a, b) => {
    const col = this.mapHeaderToKey(this.sortColumn);

    let valueA = a[col];
    let valueB = b[col];

    const timeColumns = ['hours']; // أضف أي أعمدة وقت أخرى هنا

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

    const parseNumericString = (val: any): number => {
      if (typeof val === 'string') {
        const cleaned = val.replace(/,/g, ''); // Remove commas
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      }
      return typeof val === 'number' ? val : 0;
    };

    // معالجة قيم الوقت
    if (timeColumns.includes(col) && isTimeString(valueA) && isTimeString(valueB)) {
      valueA = parseToMinutes(valueA);
      valueB = parseToMinutes(valueB);
    }

    // معالجة قيم رقمية بصيغة سترينج مع فاصلة
    else if (typeof valueA === 'string' && typeof valueB === 'string' &&
             /^[\d,]+(\.\d+)?$/.test(valueA) && /^[\d,]+(\.\d+)?$/.test(valueB)) {
      valueA = parseNumericString(valueA);
      valueB = parseNumericString(valueB);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return this.sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
    }

    if (col === 'employee') {
      return this.sortDirection === 'desc'
        ? ('' + valueA).localeCompare('' + valueB)
        : ('' + valueB).localeCompare('' + valueA);
    }

    return this.sortDirection === 'desc'
      ? ('' + valueA).localeCompare('' + valueB)
      : ('' + valueB).localeCompare('' + valueA);
  });
}



  mapHeaderToKey(header: string): string {
    const map: { [key: string]: string } = {
      'Resource': 'employee',
      'Hours': 'hours',
      'Hours %age': 'hoursPercentage',
      'Cost': 'cost',
      'Cost %age': 'costPercentage',
      
    };
    return map[header] || header;
  }

}