import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActionItem, TableComponent } from "../../../shared/components/table/table.component";
import { SettingsService } from '../settings.service';
import { CalendarDesc } from './calendar-description.model';
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { NgbDropdownModule, NgbModal, NgbOffcanvas, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AutoFormErrorDirective } from '../../../shared/directives/auto-form-error.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaxValueDirective } from '../../../shared/directives/max-value.directive';
import { SpinnerService } from '../../../shared/services/spinner.service';

declare var bootstrap: any; // Declare Bootstrap globally

@Component({
  selector: 'app-calendar-description',
  imports: [TableComponent, AutoFormErrorDirective, FormsModule, NgbDropdownModule, NgSelectModule, NgbTimepickerModule],
  templateUrl: './calendar-description.component.html',
  styleUrl: './calendar-description.component.scss'
})
export class CalendarDescriptionComponent implements OnInit {

  tableHeader = ["Description", "Action"]
  tableData: CalendarDesc[] = [];
  actionItems: ActionItem<any>[] = [];
  calendarDesc: CalendarDesc = new CalendarDesc();
  tableHeaderTitle: string = '';
  description: string;
  private selectedItem: any;
  isFilter: boolean = false;
  isAdd: boolean = false;
  isView: boolean = false;
  isEdit: boolean;
  @ViewChild('content') content!: TemplateRef<any>;




  constructor(private offcanvasService: NgbOffcanvas, private settingService: SettingsService, private modalService: NgbModal, private spinnerService: SpinnerService) {

  }
  ngOnInit(): void {
    this.getData();
  }


  submitForm(form: NgForm) {
    if (form.valid) {
      this.calendarDesc.description = this.description
      this.settingService.addCalendarLookup(this.calendarDesc).subscribe(res => {
        if (res)
          this.getData();
        else
          console.log("Faild")
      });
      form.reset();
    }
  }

  getActions(calendar: CalendarDesc) {
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
    ];
  }


  editItem(item: CalendarDesc): void {
    this.calendarDesc = new CalendarDesc();
    this.isView = false;

    this.settingService.getCalendarLookup(item.id).subscribe(res => {
      if (res) {
        this.calendarDesc = res;
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
        this.settingService.deleteCalendarLookup(item.id).subscribe(res => {
          if (res) {
            this.getData()
          }
        })
        this.getData()

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

  displayColumns = (data: CalendarDesc) => {
    return [
      //  { isText: true, text: data.id.toString() },
      { isText: true, text: data.description }
    ];
  };




  submitRequest(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.spinnerService.show();
    this.settingService.updateCalendar(this.calendarDesc).subscribe(res => {
      this.spinnerService.hide();
      this.offcanvasService.dismiss();
      if (res) {
        this.getData()
      }
    })
  }

}
