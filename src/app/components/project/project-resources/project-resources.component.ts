import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from "../../../shared/components/table/table.component";
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ProjectFilter } from '../projects/projects.model';
import { ProjectsService } from '../projects.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttachmnetComponent } from "../../../shared/components/attachmnet/attachmnet.component";
import { AttachmentType } from '../../../shared/models/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectResources, ProjectResourcesPagination } from './project-resources.model';
import { ProjectResourcesService } from '../project-resources.service';
import { forkJoin } from 'rxjs';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-project-resources',
  imports: [TableComponent, CommonModule, FormsModule, NgSelectModule],
  templateUrl: './project-resources.component.html',
  styleUrl: './project-resources.component.scss'
})
export class ProjectResourcesComponent implements OnInit {

  @ViewChild('content') content!: TemplateRef<any>;

  tableData: ProjectResourcesPagination = new ProjectResourcesPagination();
  pagination: ProjectFilter = new ProjectFilter();
  tableHeaderTitle = 'Projects Resources';
  isEdit: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  tableHeaders = ['Resource Full name ', 'Can Create Tasks', 'Can See Cost','Actions'];
  attachmentType = AttachmentType;
  Project: ProjectResources = new ProjectResources();

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
  projectId: string;
  projectName: string;
  projects: {id : number , name : string , imageURL : string}[]=[];
  transformedProjects: { name: string; value: number; }[] = [];
  users: { id: string; fullName: string; }[] = [];
  transformedUsers: {name: string; value: string; }[] = [];

  constructor(private offcanvasService: NgbOffcanvas, private projectResoursceService: ProjectResourcesService, private modalService: NgbModal, private spinnerService: SpinnerService, private route: ActivatedRoute, private lookupService: LookUpsService) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.projectName = this.route.snapshot.paramMap.get('projectName');
    this.getProjectResources()
    this.getLookups()
  }

  editItem(item: ProjectResources) {
      this.isAdd = false
      this.isEdit = true;
      this.projectResoursceService.getProjectResourcesByID(item).subscribe(res => {
        if (res) {
          this.Project = res;
          this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
        }
      })
  }

  getLookups() {
    forkJoin({
      projects: this.lookupService.getAllProjects(),
      users: this.lookupService.getAllUser(),
    }).subscribe({
      next: ({ projects, users }) => {
        if (projects) {
          this.projects = projects;
          this.transformedProjects = this.projects.map(project => {
            return {
              name: project.name,
              value: (project.id, 10) // Convert the 'id' string to a number for the 'value'
            };
          });

        }
        if (users) {
          this.users = users;
          this.transformedUsers = this.users.map(user => {
            return {
              name: user.fullName,
              value: (user.id) // Convert the 'id' string to a number for the 'value'
            };
          });
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

  getProjectResources() {
    this.projectResoursceService.getProjectResources(this.pagination, parseInt(this.projectId)).subscribe(res => { 
      if(res){
        this.tableData = res;
      }
    })
  }

  displayColumns = (data: ProjectResources) => {
    return [
      { isText: true, text: data.resourceFullName},
      { isBoolean: true, boolean: data.canCreateTasks},
      { isBoolean: true, boolean: data.canSeeCost },
    ];
  };

  deleteItem(item: ProjectResources): void {
    const modalRef = this.modalService.open(ModalComponent, {
      windowClass: 'custom-modal-center',
      modalDialogClass: 'custom-modal-content custom-modal-size'
    });
    modalRef.componentInstance.message = 'Are you sure you want to delete this record ? ';
    modalRef.componentInstance.isDeleteAction = true;
    modalRef.result.then((res: boolean) => {
      if (res) {
        this.projectResoursceService.deleteProjectResources(item.id).subscribe(res => {
          if (res) {
            this.getProjectResources()
          }
        })
      }
    })
  }



  nextPage(newPage: number) {
    this.pagination.pageNumber = newPage;

  }

  openModal(content: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = isEdit;
    this.isAdd = isAdd;
    this.isView = isView;
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  openFilter(filter: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = false;
    this.isAdd = isAdd;
    this.isView = isView;
    // this.Project = new Project();
    this.offcanvasService.open(filter, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest() {
    this.spinnerService.show();
    this.Project.projectId = parseInt(this.projectId);
    if(this.isAdd){
      this.projectResoursceService.addProjectResource(this.Project).subscribe(res =>{
        if(res){
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getProjectResources();
        }
      })
    }else if(this.isEdit){
      this.projectResoursceService.updateProjectResource(this.Project).subscribe(res =>{
        if(res){
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getProjectResources();
        }
      })
    }
  }

  getBatchId(id: any) {
    // this.Project.batchId = id + '8';
  }
}
