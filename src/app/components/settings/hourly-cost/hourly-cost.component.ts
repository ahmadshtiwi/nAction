import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HourlyCost } from './hourly-cost..model';
import { ActivatedRoute } from '@angular/router';
import { HourlyCostService } from './hourly-cost.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { LoginService } from '../../authorization/login/login.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-hourly-cost',
  imports: [FormsModule,CommonModule],
  templateUrl:'./hourly-cost.component.html',
  styleUrl: './hourly-cost.component.scss'
})
export class HourlyCostComponent implements OnInit {
  
  tableHeaders =["From Date" , "To Date" , "Hourly Rate" , "Notes" ,"Actions"];
  hourlyBody :HourlyCost[]=[];
  hourlyItem :HourlyCost=new HourlyCost();
  userId:string;
  userName: string;

  isView: boolean = false;
  tableHeaderTitle = 'Hourly Cost';
  tableHeaderSubtitle = 'This service helps you to add edit and delete the Users';
  tableHeaderButton = 'Add Item';
  isAdd: boolean = false;
  selectedIds: string[];
  isEdit: boolean;
  users: { id: string, fullName: string }[] = [];
  showConfirmationError: boolean;
  
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


  constructor( private route: ActivatedRoute ,private loginService : LoginService,
               private spinnerService: SpinnerService, private hourlyCostService:HourlyCostService ,
               private offcanvasService: NgbOffcanvas, private modalService: NgbModal){}

  ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');
        this.userName = this.route.snapshot.paramMap.get('name');

        this.getHourlyCost();
}

  getHourlyCost(){
    this.hourlyCostService.getHourlyCost(this.userId).subscribe(resp=>{
      if(resp){
        this.hourlyBody=resp;
      }
    });
  }

  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isView: boolean) {
    this.hourlyItem= new HourlyCost();
    this.hourlyItem.userId=this.userId;
    this.isAdd = isAdd;
    this.isView = isView;
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }
  
  

submitRequest(form: NgForm) { 
  if (form.invalid) {
    return
  }
  this.spinnerService.show();

  if (this.isAdd) {
    this.hourlyCostService.addHourlyCost(this.hourlyItem).subscribe(res => {
      if (res) {
        this.spinnerService.hide();
        this.offcanvasService.dismiss();
        this.getHourlyCost()
      }
    })
  } else if (this.isEdit) {
    this.hourlyCostService.updateHourlyCost(this.hourlyItem).subscribe(res => {
      this.spinnerService.hide();
      this.offcanvasService.dismiss();
      if (res) {
        this.getHourlyCost()
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
  this.isAdd=false;
  this.hourlyCostService.getHourlyCostById(item.id).subscribe(res => {
    if (res) {
      this.hourlyItem = res;
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
      this.hourlyCostService.deleteHourlyCost(item.id).subscribe(res => { this.getHourlyCost() })
    }
  }
  )
}

displayColumns = (data: HourlyCost) => {
  return [
    { isDate: true, text: data.fromDate },  // استخدم isDate بدلاً من isText للتواريخ
    { isDate: true, text: data.toDate },    // نفس الشيء هنا
    { isText: true, text: data.hourlyRate.toString()}, // اجعل isText false لأن هذا رقم
    { isText: true, text: data.notes ?? '' },  // تأكد من أن `text` لا يكون null
  ];
};
}
