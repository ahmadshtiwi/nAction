import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from '../../shared/components/table/table';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectResources, ProjectResourcesPagination } from './project-resources.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProjectResourcesService } from './project-resources.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { ProjectFilter } from '../project/projects.model';
import { AttachmentType } from '../../shared/models/enums';

@Component({
  selector: 'app-project-resource',
  imports: [CommonModule, FormsModule, NgSelectModule, Table],
  templateUrl: './project-resource.html',
  styleUrl: './project-resource.scss'
})
export class ProjectResource  implements OnInit {

  @ViewChild('content') content!: TemplateRef<any>;

  tableData: ProjectResourcesPagination = new ProjectResourcesPagination();
  pagination: ProjectFilter = new ProjectFilter();
  tableHeaderTitle = 'Projects Resources';
  isEdit: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  tableHeaders = ['Resource Full name ', 'Can Create Tasks', 'Can See Cost','Actions'];
  attachmentType = AttachmentType;
  ProjectResourse: ProjectResources = new ProjectResources();

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

  constructor(private offcanvasService: NgbOffcanvas, private projectResoursceService: ProjectResourcesService, 
    private modalService: NgbModal, private spinnerService: SpinnerService,
     private route: ActivatedRoute, private lookupService: LookUpsService) { }

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
          this.ProjectResourse = res;
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
              value: (project.id) // Convert the 'id' string to a number for the 'value'
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
        this.pagination.pageSize = 13;
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
        this.pagination.totalCount = res.totalCount;
        this.pagination.pageNumber = res.pageNumber;
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



  nextPage(newPage: number) { debugger
    this.pagination.pageNumber = newPage;
    this.getProjectResources()

  }

  openModal(content: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = isEdit;
    this.isAdd = isAdd;
    this.isView = isView;
    if(isAdd)
    {
          this.ProjectResourse = new ProjectResources();

    }
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  openFilter(filter: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = false;
    this.isAdd = isAdd;
    this.isView = isView;
    // this.Project = new Project();
    this.offcanvasService.open(filter, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest(ProjectsForm:NgForm) { debugger
    if(ProjectsForm.invalid)
      return;
    this.spinnerService.show();
    this.ProjectResourse.projectId = parseInt(this.projectId);
    if(this.isAdd){
      this.projectResoursceService.addProjectResource(this.ProjectResourse).subscribe(res =>{
        if(res){
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getProjectResources();
        }
      })
    }else if(this.isEdit){
      this.projectResoursceService.updateProjectResource(this.ProjectResourse).subscribe(res =>{
        if(res){
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getProjectResources();
        }
      })
    }

setTimeout(() => this.spinnerService.hide(), 2000);
  }


}
