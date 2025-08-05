import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { LookUpsService } from '../../../shared/services/look-ups.service';
import { ResourceAllocationService } from './resource-allocation.service';
import { ResourceAllocation } from './resource-allocation.model';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Table } from "../../../shared/components/table/table";

@Component({
  selector: 'app-resource-allocation',
  imports: [FormsModule, CommonModule, NgSelectModule, Table],
  templateUrl: './resource-allocation.html',
  styleUrl: './resource-allocation.scss'
})
export class ResourceAllocationComponent implements OnInit {

  tableHeaders = ["Project","Time", "From Date", "To Date",  "Note", "Actions"];
  resourceAllocationBody: ResourceAllocation[] = [];
  tableHeaderTitle='Resource Allocation'
  resourceAllocation: ResourceAllocation = new ResourceAllocation();
  userId: string;
  userName: string;
  isView: boolean = false;
  isAdd: boolean = false;
  isEdit: boolean;
    messagePer:string|null;
  isValidPer:boolean=true;


  projects: { id: number, name: string, imageURL: string }[] = [];
  transformedProjects: { name: string; value: number; }[] = [];
  availableHours = [
    { label: "0", value: "00:00:00" },
    { label: "30 minutes", value: "00:30:00" },
    { label: "1 hour", value: "01:00:00" },
    { label: "1 hour 30 minutes", value: "01:30:00" },
    { label: "2 hours", value: "02:00:00" },
    { label: "2 hours 30 minutes", value: "02:30:00" },
    { label: "3 hours", value: "03:00:00" },
    { label: "3 hours 30 minutes", value: "03:30:00" },
    { label: "4 hours", value: "04:00:00" },
    { label: "4 hours 30 minutes", value: "04:30:00" },
    { label: "5 hours", value: "05:00:00" },
    { label: "5 hours 30 minutes", value: "05:30:00" },
    { label: "6 hours", value: "06:00:00" },
    { label: "6 hours 30 minutes", value: "06:30:00" },
    { label: "7 hours", value: "07:00:00" },
    { label: "7 hours 30 minutes", value: "07:30:00" },
    { label: "8 hours", value: "08:00:00" },
    { label: "8 hours 30 minutes", value: "08:30:00" },
    { label: "9 hours", value: "09:00:00" },
    { label: "9 hours 30 minutes", value: "09:30:00" },
    { label: "10 hours", value: "10:00:00" },
    { label: "10 hours 30 minutes", value: "10:30:00" },
    { label: "11 hours", value: "11:00:00" },
    { label: "11 hours 30 minutes", value: "11:30:00" },
    { label: "12 hours", value: "12:00:00" },
    { label: "12 hours 30 minutes", value: "12:30:00" },
    { label: "13 hours", value: "13:00:00" },
    { label: "13 hours 30 minutes", value: "13:30:00" },
    { label: "14 hours", value: "14:00:00" },
    { label: "14 hours 30 minutes", value: "14:30:00" },
    { label: "15 hours", value: "15:00:00" },
    { label: "15 hours 30 minutes", value: "15:30:00" },
    { label: "16 hours", value: "16:00:00" }
  ];

  @ViewChild('content') content!: TemplateRef<any>;

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


  constructor(private route: ActivatedRoute, private lookupService: LookUpsService,
    private spinnerService: SpinnerService, private resourceService: ResourceAllocationService,
    private offcanvasService: NgbOffcanvas, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userName = this.route.snapshot.paramMap.get('name');
    this.getLookups(this.userId);
    this.getResourceAllocation();
  }

  getResourceAllocation() {
    this.resourceService.getResourceAllocation(this.userId).subscribe(resp => {
      if (resp) {
        this.resourceAllocationBody = resp;
      }
    });
  }

  getLookups(userId?:string) { debugger
    this.lookupService.getAllProjects(userId).subscribe(res => {
      if (res) {
        this.projects = res;
        this.transformedProjects = this.projects.map(project => {
          return {
            name: project.name,
            value: (project.id) // Convert the 'id' string to a number for the 'value'
          };
        });
      }
    })
  }
  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.resourceAllocation = new ResourceAllocation();
    this.resourceAllocation.userId = this.userId;
    this.isAdd = isAdd;
    this.isView = isView;
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }



  submitRequest(form: NgForm) {
   if (form.invalid || !this.isValidPer) {
      return
    }
    this.spinnerService.show();

    if (this.isAdd) {
      this.resourceService.addResourceAllocation(this.resourceAllocation).subscribe(res => {
        if (res) {
          this.spinnerService.hide();
          this.offcanvasService.dismiss();
          this.getResourceAllocation()
        }
      })
    } else if (this.isEdit) {
      this.resourceService.updateResourceAllocation(this.resourceAllocation).subscribe(res => {
        this.spinnerService.hide();
        this.offcanvasService.dismiss();
        if (res) {
          this.getResourceAllocation()
        }
      })
    } else {
      //  this.spinnerService.hide();
      this.isView = true;
    }
  }

  editItem(item: any): void {
    this.isView = false;
    this.isEdit = true;
    this.isAdd = false;
    this.resourceService.getResourceAllocationById(item.id).subscribe(res => {
      if (res) {
        this.resourceAllocation = res;
        this.resourceAllocation.timeOfAllocation += ':00'
        this.offcanvasService.open(this.content, { position: 'end', panelClass: 'custom-offcanvas' });
      }
    })
  }

    checkFromDate() {
    if (this.resourceAllocation.fromDate > this.resourceAllocation.toDate) {
      this.messagePer = "From Date must be less than or equal to the To Date.";
      this.isValidPer = false;
    } else {
      this.messagePer = null;
      this.isValidPer = true;
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
        this.resourceService.deleteResourceAllocation(item.id).subscribe(res => { this.getResourceAllocation() })
      }
    }
    )
  }

  displayColumns = (data: ResourceAllocation) => {
    return [
      {isText:true,text:data.projectName},
      { isText: true, text: data.timeOfAllocation }, // اجعل isText false لأن هذا رقم

      { isDate: true, text: data.fromDate },  // استخدم isDate بدلاً من isText للتواريخ
      { isDate: true, text: data.toDate },    // نفس الشيء هنا
      { isText: true, text: data.note ?? '' },  // تأكد من أن `text` لا يكون null
    ];
  };
}
