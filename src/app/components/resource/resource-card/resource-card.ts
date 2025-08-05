import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { User, UsersFilter } from '../user.model';
import { Password } from '../../auth/login/login.model';
import { AttachmentType } from '../../../shared/models/enums';
import { NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users.service';
import { AlertService } from '../../../shared/services/alert.service';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { CacheService } from '../../../shared/services/cache.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { RolesService } from '../../settings/roles/roles.service';
import { Role } from '../../settings/roles/roles.model';
import { forkJoin } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Attachment } from '../../../shared/components/attachment/attachment';
import { AutoFormErrorDirective } from '../../../shared/directives/auto-form-error.directive';
import { RestrictNonNumericDirective } from '../../../shared/directives/restrict-non-numeric.directive';
import { UserCardComponent } from '../../../shared/components/user-card/user-card.component';

@Component({
  selector: 'app-resource-card',
  imports: [UserCardComponent, AutoFormErrorDirective, FormsModule, NgbDropdownModule, NgSelectModule, CommonModule, RestrictNonNumericDirective, Attachment],
  templateUrl: './resource-card.html',
  styleUrl: './resource-card.scss'
})
export class ResourceCard implements OnInit {
  componentName = 'NewUser'
  cardData: User[] = [];
  User: User = new User();
  users: { id: string, fullName: string }[] = [];
  pagination: UsersFilter = new UsersFilter();
  roles: Role[] = [];


  userId: string;
  isEdit: boolean;
  showConfirmationError: boolean;
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  selectedIds: string[];
  filterName: string = "";
  activeCardId: string | null = null;
  attachmentType = AttachmentType;

  password: Password = new Password();
  @ViewChild('content') content!: TemplateRef<any>;
  @ViewChild('passwordTemplate') passwordTemplate!: TemplateRef<any>;

  actionItems = [
    {
      viewAction: true,
      label: 'Edit',
      icon: 'bi-pencil',
      action: (item: any) => this.editItem(item),
    },
    // {
    //   viewAction: true,
    //   label: 'User Calendar',
    //   icon: 'bi-calendar',
    //   action: (item: any) => this.gouToUserCalendar(item),
    // },
    {
      viewAction: true,
      label: 'Hourly Cost',
      icon: 'fa-solid fa-business-time',
      action: (item: any) => this.goToHourlyCost(item),
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
    
      {
        viewAction: true,
        label: 'Allocation',
        icon: 'bi bi-pin-map-fill',
        action: (item: any) => this.goToResourceAllocation(item),
      },
  ];

  /* for filter data 
  *  if search empty take carddata else will exuec filter 
  */
  get filteredCardData() {
    if (!this.filterName.trim()) return this.cardData;
    const lowerFilter = this.filterName.toLowerCase();
    return this.cardData.filter(data =>
      data.fullName.toLowerCase().includes(lowerFilter)
    );
  }


  constructor(private offcanvasService: NgbOffcanvas, private userService: UsersService,
    private router: Router, private alertService: AlertService,
    private rolesService: RolesService, private lookUpService: LookUpsService,
    private spinnerService: SpinnerService, private cacheService: CacheService<UsersFilter>
  ) { }


  ngOnInit(): void {
    this.getData();
    this.getLookups();
  }
  getBatchId(id: any) {
    this.User.batchId = id + '8';
  }

  /**
   * to hide menu when click any position on screen 
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // إذا النقر خارج زر القائمة أو القائمة نفسها
    if (!target.closest('.card') && !target.closest('.action-menu')) {
      this.activeCardId = null;
    }
  }
  handleMenuToggle(cardId: string) {
    this.activeCardId = this.activeCardId === cardId ? null : cardId;
  }
  onViewersChange(selectedIds: string[]) {
    this.User.viewers = selectedIds.map(id => ({ viewerId: id }));
  }


  getLookups() {

    let cacheData = this.cacheService.getPageState(this.componentName);
    if (cacheData) {
      this.pagination = cacheData;
    }

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
  submitRequest(form: NgForm) {
    if (form.invalid) {
      return
    }

    // this.spinnerService.show();
    if (this.User.inActiveDate == "") {
      this.User.inActiveDate = null
    }
    if (this.User.backLogDay == "") {
      this.User.backLogDay = null
    }
    if (this.User.maxDateSearch == "") {
      this.User.maxDateSearch = null
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
  getData() {

    let cacheData = this.cacheService.getPageState(this.componentName);
    if (cacheData) {
      this.pagination = cacheData;
    }
    this.pagination.pageSize = 100;
    this.spinnerService.show();
    this.userService.getAllUser(this.pagination).subscribe(res => {
      if (res) {
        this.pagination.totalCount = res.totalCount;
        this.pagination.totalPages = res.totalPages;
        this.pagination.pageNumber = res.pageNumber;
        this.cardData = res.items;
        this.spinnerService.hide()
      }
    })
  }


  editItem(item: User): void {
    this.isView = false;
    this.isEdit = true;
    this.spinnerService.show();
    this.userService.getUserByID(item.id).subscribe(res => {
      console.log(res);
      if (res) {
        debugger
        this.User = res;
        this.spinnerService.hide();
        this.selectedIds = res.viewers.map(x => x.viewerId)
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

  // goToUserCalendar(item: User) {
  //   this.router.navigate(['/pages/user-calendar', item.id, item.fullName])
  // }
 goToResourceAllocation(item: User) {
      this.router.navigate(['/pages/resource-allocation', item.id, item.fullName])
    }
  goToHourlyCost(item: User) {
    this.router.navigate(['/pages/hourly-cost', item.id, item.fullName])
  }

  openResetModal = (item: User) => {
    this.userId = item.id;
    this.offcanvasService.open(this.passwordTemplate, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  unlockUser = (item: User) => {
    this.userService.unlockUser(item).subscribe(res => {
      if (res == true) {
        this.alertService.success('User unlocked successfully')
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

  resetPassword(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.userService.resetPassword(this.password.newPassword, this.userId).subscribe(res => {
      if (res) {
        this.getData();
        this.offcanvasService.dismiss();
      }
    })
  }

  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isEdit: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isEdit = isEdit;
    this.User = new User();
    const today = new Date();
    this.User.systemJoinDate = today.toISOString().split('T')[0];
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  filter() {


    if (this.filterName != "")
      this.cardData = this.cardData.filter(item => item.fullName.toLowerCase().includes(this.filterName.toLowerCase()));

    else
      this.getData();
  }
  isVisible(data: any): boolean {
    if (!this.filterName.trim()) return true;
    return data.fullName.toLowerCase().includes(this.filterName.toLowerCase());
  }
}


