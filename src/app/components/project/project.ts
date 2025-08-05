import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Project, ProjectFilter } from './projects.model';
import { AttachmentType, ResourcesType } from '../../shared/models/enums';
import { NgbDropdownModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { ProjectService } from './project.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Table } from '../../shared/components/table/table';
import { AutoFormErrorDirective } from '../../shared/directives/auto-form-error.directive';
import { FormsModule, NgForm } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Attachment } from "../../shared/components/attachment/attachment";

@Component({
  selector: 'app-project.component',
  imports: [Table, AutoFormErrorDirective, FormsModule, NgbDropdownModule, NgSelectModule, Attachment],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class ProjectComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  tableHeaderTitle = 'Projects service';
  tableHeaderSubtitle = 'This service helps you to add edit and delete the Projects';
  tableHeaderButton = 'Add Item';
  tableHeaders = ['Project Initial ', 'Name', 'Project image', 'Active', 'Private Resources','Actions'];
  tableData: Project[] = [];
  Project: Project = new Project();
  pagination: ProjectFilter = new ProjectFilter();
  isEdit: boolean = false;
  resourceType: ResourcesType = ResourcesType.Public;
  resourceTypeEnum = ResourcesType;
  isAdd: boolean = false;
  isView: boolean = false;
  actionItems : any[] = [];
  attachmentType = AttachmentType;
  isPrivate: boolean = false;

  constructor(private offcanvasService: NgbOffcanvas, private projectService: ProjectService, private modalService: NgbModal, private spinnerService: SpinnerService, private router: Router) {
    this.getData()
  }

  ngOnInit(): void { }

  getActionItems(event: Project) {
    this.actionItems = [
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
      {
        viewAction: event.resourcesType == this.resourceTypeEnum.Private,
        label: 'Resources',
        icon: 'bi-people-fill',
        action: (item: Project) => this.goToResourceProjects(item),
      },
    ]
    }

  getData() {
    this.spinnerService.show()
    this.projectService.getAllProject(this.pagination).subscribe(res => {
      if (res) {
        this.spinnerService.hide();
        this.tableData = res.items;
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
      }
    })
  }

  openFilter(filter: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = false;
    this.isAdd = isAdd;
    this.isView = isView;
    this.Project = new Project();
    this.offcanvasService.open(filter, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  displayColumns = (data: Project) => {
    return [
      { isText: true, text: data.projectCode },
      { isText: true, text: data.projectName },
      { isImage: true, text: data.imageURL ? data.imageURL : null },
      { isBoolean: true, boolean: data.isActive },
      { isBoolean: true, boolean: data.resourcesType !=0 },
    ];
  };

  getBatchId(id: any) {
    this.Project.batchId = id + '8';
  }

  editItem(item: any): void {
    this.isAdd = false
    this.isEdit = true;
    this.projectService.getProjectByID(item.id).subscribe(res => {
      if (res) {
        this.Project = res;
        this.isPrivate = res.resourcesType == this.resourceTypeEnum.Private;
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
        this.projectService.deleteProject(item.id).subscribe(res => {
          if (res) {
            this.getData();
          }
        })
      }
    })
  }

  viewDetails(data: any) {
    console.log('View Details:', data);
  }

  nextPage(newPage: number) {
    this.pagination.pageNumber = newPage;
    this.getData()
  }

  onCheckboxChange() {
    if(this.isAdd){
      this.resourceType = this.isPrivate ? ResourcesType.Private : ResourcesType.Public;
    }else if(this.isEdit){
      this.Project.resourcesType = this.isPrivate ? ResourcesType.Private : ResourcesType.Public;
    }
  }

  openModal(content: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = isEdit;
    this.isAdd = isAdd;
    this.isView = isView;
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  goToResourceProjects(item: Project) {
    this.router.navigate(['/pages/project-resource', item.id, item.projectName])
  }

  submitRequest(ProjectsForm:NgForm) { 
    debugger
if(ProjectsForm.invalid)
  return;
    // this.Project.resourcesType = this.resourceType;
    this.spinnerService.show();
    if (this.isAdd) {
      this.projectService.addProject(this.Project).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else if (this.isEdit) {
      this.projectService.updateProject(this.Project).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else {
      this.spinnerService.hide();
      this.isView = true;
    }
  }
}
