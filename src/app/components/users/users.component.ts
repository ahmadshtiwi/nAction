import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableComponent } from '../../shared/components/table/table.component';
import { PaginationFilter } from '../../shared/models/pagination.model';
import { User, UsersFilter } from './users.model';
import { UsersService } from './users.service';
import { AutoFormErrorDirective } from '../../shared/directives/auto-form-error.directive';
import { RolesService } from '../settings/roles/roles.service';
import { Role } from '../settings/roles/roles.model';
import { AlertService } from '../../shared/services/alert.service';
import { forkJoin } from 'rxjs';
import { LookUpsService } from '../../shared/services/look-ups.service';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Password } from '../layout/passwords.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestrictNonNumericDirective } from '../../shared/directives/restrict-non-numeric.directive';

@Component({
  selector: 'app-users',
  imports: [TableComponent, AutoFormErrorDirective, FormsModule, NgbDropdownModule, NgSelectModule , CommonModule, RestrictNonNumericDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('passwordTemplate') passwordTemplate!: TemplateRef<any>;
  tableHeaderTitle = 'Resource List';
  tableHeaderSubtitle = 'This service helps you to add edit and delete the Users';
  tableHeaderButton = 'Add Item';
  tableHeaders = ['Full Name ', 'Email ', 'Inactive date','Show Cost', 'Admin', 'Actions'];
  tableData: User[] = [];
  User: User = new User();
  pagination: UsersFilter = new UsersFilter();
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  selectedIds: string[];
  password: Password = new Password();

  actionItems = [
    {
      viewAction: true,
      label: 'Edit',
      icon: 'bi-pencil',
      action: (item: any) => this.editItem(item),
    },
    {
      viewAction: true,
      label: 'User Calendar',
      icon: 'bi-calendar',
      action: (item: any) => this.gouToUserCalendar(item),
    },
    {
      viewAction: true,
      label: 'Hourly Cost',
      icon: 'bi bi-currency-dollar',
      action: (item: any) => this.gouToHourlyCost(item),
    },
    {
      viewAction: true,
      label: 'Reset password',
      icon: 'bi-key-fill',
      action: (item: any) => this.openResetModal(item),
    },
    {
      viewAction: true,
      label: 'Unlock the user',
      icon: 'bi-unlock-fill',
      action: (item: any) => this.unlockUser(item),
    },
  ];
  roles: Role[] = [];
  isEdit: boolean;
  users: { id: string, fullName: string }[] = [];
  showConfirmationError: boolean;
  userId: string;

  constructor(private offcanvasService: NgbOffcanvas, private userService: UsersService, private router : Router , private alertService : AlertService ,
    private rolesService: RolesService, private lookUpService: LookUpsService, private spinnerService: SpinnerService) {
  }

  ngOnInit(): void {
    this.getData();
    this.getLookups();
  }

  onViewersChange(selectedIds: string[]) {
    this.User.viewers = selectedIds.map(id => ({ viewerId: id }));
  }

  getLookups() {

    forkJoin({
      roles: this.rolesService.getAllRole(),
      users: this.lookUpService.getAllUser(),
    }).subscribe({
      next: ({ roles, users }) => {
        if (roles) {
          this.roles = roles;
        }
        if (users) {
          this.users = users;
        }

        // Reset the pageSize after retrieving the data
        this.pagination.pageSize = 10;
      },
      error: (err) => {
        console.error('Error occurred while fetching data:', err);
      },
    });
  }

  getData() {
    this.spinnerService.show();
    this.userService.getAllUser(this.pagination).subscribe(res => {
      if (res) {
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
        this.tableData = res.items;
        this.spinnerService.hide()
      }
    })
  }

  openFilter(filter: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isView = isView;
    this.User = new User();
    this.offcanvasService.open(filter, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  displayColumns = (data: User) => {
    return [
      { isText: true, text: data.fullName },
      { isText: true, text: data.email },
      { isText: true, text: data.inActiveDate },
      { isText: true, text: data.showHourlyCost?"Yes":"" },
      { isText: true, text: data.roles },
    ];
  };

  openResetModal = (item : User) =>{
    this.userId = item.id;
    this.offcanvasService.open(this.passwordTemplate , { position: 'end', panelClass: 'custom-offcanvas' });
  }

  unlockUser = (item : User) =>{
    this.userService.unlockUser(item).subscribe(res=>{
      if(res == true){
        this.alertService.success('User unlocked successfully')
      }
    })
  }

  gouToUserCalendar(item: User) {
    this.router.navigate(['/pages/user-calendar' , item.id , item.fullName])
  }

  gouToHourlyCost(item: User) {
    this.router.navigate(['/pages/hourly-cost' , item.id ,item.fullName])
  }


  resetPassword(form: NgForm) {
    if(form.invalid){
      return
    }
    this.userService.resetPassword(this.password.newPassword , this.userId ).subscribe(res =>{
      if (res){
        this.getData();
        this.offcanvasService.dismiss();
      }
    })
  }

  editItem(item: User): void {
    this.isView = false;
    this.isEdit = true;
    this.userService.getUserByID(item.id).subscribe(res => {
      if (res) {
        this.User = res;
        this.selectedIds = res.viewers.map(x => x.viewerId)
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

  checkConfirmPassword() {
    if (this.password.confirmPassword != this.password.newPassword) {
      this.showConfirmationError = true;
    } else {
      this.showConfirmationError = false;
    }
  }

  deleteItem(item: any): void {
    this.userService.deleteUser(item.id).subscribe(res => {
      if (res) {
        this.offcanvasService.dismiss();
        this.getData();
      }
    })
  }

  nextPage(newPage: number) {
    console.log('Page changed to:', newPage);
    this.pagination.pageNumber = newPage;
    this.getData();
  }

  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isEdit: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isEdit=isEdit;
  
    this.User = new User();
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  submitRequest(form: NgForm) {
    if (form.invalid) { 
      return
    }

   // this.spinnerService.show();
    if(this.User.inActiveDate == ""){
      this.User.inActiveDate = null
    }
    if (this.isAdd) {
      this.userService.addUser(this.User).subscribe(res => {
        if (res) {
       //   this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getData()
        }
      })
    } else if (this.isEdit) {
      this.userService.updateUser(this.User).subscribe(res => {
      //  this.spinnerService.hide();
        this.offcanvasService.dismiss();
        if (res) {
          this.getData()
        }
      })
    } else {
    //  this.spinnerService.hide();
      this.isView = true;
    }
  }
}
