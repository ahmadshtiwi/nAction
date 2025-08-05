import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationFilter } from '../../../shared/models/pagination.model';
import { Role } from './roles.model';
import { RolesService } from './roles.service';
import { AutoFormErrorDirective } from '../../../shared/directives/auto-form-error.directive';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PermissionTransformService } from './permission-transform.service';

@Component({
  selector: 'app-roles',
  imports: [TableComponent, AutoFormErrorDirective, FormsModule, NgbDropdownModule, NgSelectModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  @ViewChild('content') content!: TemplateRef<any>;
  tableHeaderTitle = 'Roles service';
  tableHeaderSubtitle = 'This service helps you to add edit and delete the Roles';
  tableHeaderButton = 'Add Item';
  tableHeaders = [ 'Name ', 'Actions'];
  tableData: Role[] = [];
  role: Role = new Role();
  pagination: PaginationFilter = new PaginationFilter();
  isEdit: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
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
  permissions: string[];
  permissionsList: Record<string, string[]>;
  mainPermissions : string[] = ['Resources' , 'APP:Roles' , 'Projects' , 'APP:Calendar' , 'Daily.Log' , 'Active.Tasks' , 'Report:Performance' , 'Report:Project.Cost','Report:Top.Ten'];

  constructor(private offcanvasService: NgbOffcanvas, private RoleService: RolesService , private modalService : NgbModal , private perm : PermissionTransformService) {
    this.getData()
  }

  ngOnInit(): void {
    this.getPermissions();
  }

  getPermissions() {
     this.RoleService.getAllPermissions().subscribe(res=>{
      if(res){
        this.permissions = res;
        console.log( this.perm.transformPermissions(this.permissions).permissions)
        this.permissionsList = this.perm.transformPermissions(this.permissions).permissions
      }
    })
  }

  getData() {
    this.RoleService.getAllRole().subscribe(res => {
      if (res) {
        this.tableData = res;
        this.pagination.totalCount = 10;
        this.pagination.totalPages = 1;
        this.pagination.pageSize = 10;
        this.pagination.pageNumber = 1;
      }
    })
  }

  displayColumns = (data: Role) => {
    return [
      { isText: true, text: data.name },
    ];
  };

  editItem(item: any): void {
    this.isView = false;
    this.isAdd = false;
    this.isEdit = true;
    this.RoleService.getRoleByID(item.id).subscribe(res => {
      if (res) {
        this.role = res;     
        // Ensure checkboxes update correctly in UI
        setTimeout(() => {
          this.role.permissions.forEach(permission => {
            const mockEvent = { target: { checked: true } };
            this.updatePermissions(mockEvent, permission);
          });
        });
  
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    });
  }
  

  updatePermissions(event: any, permissionValue: string) {
    if (event.target.checked) {
      // Check if the permission already exists before adding
      if (!this.role.permissions.includes(permissionValue)) {
        this.role.permissions.push(permissionValue);
      }
    } else {
      // Remove from array if unchecked
      this.role.permissions = this.role.permissions.filter(p => p !== permissionValue);
    }
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
        this.RoleService.deleteRole(item.id).subscribe(res => { 
          if(res){
            this.getData()
          }
        })
      }
    }
    )
  }

  viewDetails(item: any): void {
    this.isView = true;
    this.RoleService.getRoleByID(item.id).subscribe(res => {
      if (res) {
        this.role = res;
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

  nextPage(newPage: number) {
    console.log('Page changed to:', newPage);
    this.pagination.pageNumber = newPage;
  }

  openModal(content: TemplateRef<any>, isEdit: boolean, isAdd: boolean, isView: boolean) {
    this.isEdit = isEdit;
    this.isAdd = isAdd;
    this.isView = isView;
    this.role = new Role()
    this.getPermissions();
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest() {
    if (this.isAdd) {
      this.RoleService.addRole(this.role).subscribe(res => {
        if (res) {
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else if (this.isEdit) {
      this.RoleService.updateRole(this.role).subscribe(res => {
        if (res) {
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else {
      this.isView = true;
    }
  }
}
