import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbOffcanvas, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ActionItem, Table } from '../../../shared/components/table/table';
import { AttachmentType } from '../../../shared/models/enums';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { SettingsService } from '../settings.service';
import { CalendarDescription } from './calendar-description.model';
import { Attachment } from "../../../shared/components/attachment/attachment";
import { CommonModule } from '@angular/common';
import { AutoFormErrorDirective } from '../../../shared/directives/auto-form-error.directive';

@Component({
  selector: 'app-calendar-description',
  imports: [Attachment, CommonModule, FormsModule, Table,AutoFormErrorDirective],
  templateUrl: './calendar-description.html',
  styleUrl: './calendar-description.scss'
})
export class CalendarDescriptionComponent implements OnInit {

  tableHeaderTitle: string = 'Work Day Type';
  tableHeaders = ["Description", "Header Text", "Image", "Actions"]
  tableData: CalendarDescription[] = [];
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
  CalendarDescription: CalendarDescription = new CalendarDescription();
  attachmentType = AttachmentType;
  description: string;
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  isEdit: boolean;
  @ViewChild('content') content!: TemplateRef<any>;




  constructor(private offcanvasService: NgbOffcanvas, private settingService: SettingsService,
    private modalService: NgbModal, private spinnerService: SpinnerService) {

  }
  ngOnInit(): void {
    this.getData();
  }


  openModal(content: TemplateRef<any>, isFilter: boolean, isAdd: boolean, isEdit: boolean) {
    this.isFilter = isFilter;
    this.isAdd = isAdd;
    this.isEdit = isEdit;
    if(isAdd){

      this.CalendarDescription = new CalendarDescription();
    }
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }


  getBatchId(id: any) {
    this.CalendarDescription.batchId = id + '8';
  }

  editItem(item: CalendarDescription): void {
    this.CalendarDescription = new CalendarDescription();
    this.isView = false;

    this.settingService.getCalendarLookup(item.id).subscribe(res => {
      if (res) {
        this.CalendarDescription = res;
        this.openModal(this.content,false,false,true);
        
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
        this.settingService.deleteCalendarLookup(item.id).subscribe(res => {
          if (res) { 
            this.getData()
          }
        })
      }
    })
  }

  getData() {
    this.settingService.getCalendarLookups().subscribe(res => {
      if (res) {
        this.tableData = res;
      }
    })
  }

  displayColumns = (data: CalendarDescription) => {
    return [
      //  { isText: true, text: data.id.toString() },
      { isText: true, text: data.description },
      { isText: true, text: data.headerText },
      { isImage: true, text: data.imageUrl }
    ];
  };

  submitRequest(form: NgForm) { debugger
    if (form.invalid) {
      return
    }

    this.spinnerService.show();
    if(this.isAdd){
      this.settingService.addCalendarLookup(this.CalendarDescription).subscribe(res => {
        if (res)
          this.getData();
        this.spinnerService.hide();
    
      });
    }
    else if(this.isEdit){
          this.settingService.updateCalendar(this.CalendarDescription).subscribe(res => {
            this.offcanvasService.dismiss();
            if (res) {
              this.getData()
              this.spinnerService.hide();
          }
      })
    }

    this.offcanvasService.dismiss();

  }
  
  // submitForm(form: NgForm) {
  //   if (form.valid) {
  //     this.CalendarDescription.description = this.description
  //     this.settingService.addCalendarLookup(this.CalendarDescription).subscribe(res => {
  //       if (res)
  //         this.getData();
  //       else
  //         console.log("Faild")
  //     });
  //     form.reset();
  //   }
  // }


}
