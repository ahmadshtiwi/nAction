import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnData, TableComponent } from "../../../shared/components/table/table.component";
import { ProjectCost, ProjectCostPagination, ProjectCostSummary } from './project-cost.model';
import { OpenTasksService } from '../open-tasks.service';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../project/projects.service';
import { Project } from '../../project/projects/projects.model';
import { LookUpsService } from '../../../shared/services/look-ups.service';

@Component({
  selector: 'app-project-costs',
  imports: [NgbCarouselModule, TableComponent, FormsModule],
  templateUrl: './project-costs.component.html',
  styleUrl: './project-costs.component.scss'
})
export class ProjectCostsComponent implements OnInit {

  pagination: ProjectCostPagination = new ProjectCostPagination();
  tableHeaders: string[] = ['Resource', 'Hours' ,'Hours %age', 'Cost', 'Cost %age'];
  projectCostData: ProjectCost[] = [];
  projectCostSummary : ProjectCostSummary = new ProjectCostSummary();

  constructor(private projectService: ProjectsService , private openTasksService : OpenTasksService, private lookupService : LookUpsService) { }

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

  getProjectCost(projectId: number) {
    this.pagination.projectId = projectId;
    this.openTasksService.getProjectCost(this.pagination).subscribe(res =>{
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
        { isText: true, text: data.cost },
        { isText: true, text: data.costPercentage + '%' },
      ];
    };

    nextPage(newPage: number) {
      console.log('Page changed to:', newPage);
      this.pagination.pageNumber = newPage;
      this.getProjectCost(this.pagination.projectId);
    }
}