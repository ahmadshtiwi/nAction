import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BadgesComponent } from '../badges/badges.component';
import { TimeFormatPipe } from "../../pipes/time.pipe";
import { FormsModule } from '@angular/forms';
import { MaxValueDirective } from '../../directives/max-value.directive';
import { RestrictNonNumericDirective } from '../../directives/restrict-non-numeric.directive';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-table',
  imports: [NgbModule, NgbPaginationModule, CommonModule, RouterModule, NgSelectModule ,BadgesComponent, TimeFormatPipe, FormsModule , MaxValueDirective, RestrictNonNumericDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {
  @Input() tableData: T[];
  @Input() collectionSize: number;
  @Input() page: number;
  @Input() pageSize: number = 10;
  @Input() tableHeaderTitle: string;
  @Input() tableHeaderSubtitle: string;
  @Input() tableHeaderButton: string;
  @Input() logRoute: string;
  @Input() unsubmittedComponentRouting: string;
  @Input() tableHeaders: string[];
  @Input() displayColumns: (item: T) => ColumnData[];
  @Input() isViewOnly: boolean;
  @Input() removeAddButton: boolean;
  @Input() viewUnsubmittedRequestButton: boolean = false;
  @Input() removeActions: boolean = false;
  @Input() removeFilter: boolean = false;
  @Input() viewLog: boolean = false;
  @Input() removeTableHeader: boolean;
  @Input() removeBorderRadius: boolean;
  @Input() removePagination: boolean;
  @Input() addStatus: boolean;

  @Input() btnName: string;              // added Ahmad Shtiwi
  @Input() idName: string;               // added Ahmad Shtiwi
  @Input() isLog: boolean;               // added Ahmad Shtiwi
  @Input() tableWidth: string = '';               // added Ahmad Shtiwi
  @Input() columnFilters: Record<string, { isTime :boolean, isText: boolean,isText2: boolean, isDropdown: boolean, isDates: boolean , multiple :boolean , options : {name : string , value : any}[] }> = {};
  @Input() filterableColumn: boolean = false;
  @Input() actionItems: ActionItem<T>[];
  @Output() dropdownToggle = new EventEmitter<T>();
  @Output() pageChangeEvent = new EventEmitter<number>();
  @Output() addButtonEvent = new EventEmitter<void>();
  @Output() openFilterModalEvent = new EventEmitter<void>();
  @Output() viewDetailsEvent = new EventEmitter<T>();
  
  @Output() filterChanged = new EventEmitter<Record<string, any>>();
  @Output() activateFilteration = new EventEmitter<boolean>();

  filters: Record<string, any> = {};
  filterCollapsed = false;

  filter: Filters = new Filters();

  constructor(private router: Router) { }

  openModal() {
    this.addButtonEvent.emit();
  }

  openFilterModal() {
    this.openFilterModalEvent.emit();
  }

  activateFilter() {
    this.activateFilteration.emit(true)
  }

  nextPage() {
    this.pageChangeEvent.emit(this.page);
  }

  viewDetails(item: T) {
    this.viewDetailsEvent.emit(item);
  }

  executeAction(item: T, action: (item: T) => void) {

    action(item);
  }

  navigateToLog(id: T[keyof T] , data : any): void {
    if(!data.canEnter && data.canEnter != undefined){
      console.log('hi')
    }else{
    if (id) {
      this.router.navigate(['/pages/tasks', id]);
    }
  }
  }

  applyColumnFilter(header: string, event: any) {
    if (!event) {
        console.warn(`applyColumnFilter called with undefined event for header: ${header}`);
        return;
    }

    let value: any;

    // this handling for single selection
    if (event && event.hasOwnProperty('value')) {
        value = event.value;
    } else if (event.target) {
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        value = target?.value || '';
    }

    if(Array.isArray(event)){
      this.filters[header] = event.map(x=> x.value);
    }else{
      this.filters[header] = value;
    }

    // Set the filter for the column and emit the filter change
    this.filterChanged.emit(this.filters);
}


  onDropdownToggleClick(item: T) {
    // Emit the event with the relevant item data to notify the parent component
    this.dropdownToggle.emit(item);
  }

  // getPageSymbol(pageNumber: number): string {
  //   const currentLang = this.translateService.currentLang;
  //   return new Intl.NumberFormat(currentLang === 'ar' ? 'ar-EG' : 'en-US').format(pageNumber);
  // }

  shouldDisableLogButton(data: any): boolean {
    // Replace 'status' with the key you want to check
    // Example: disable if status is 'inactive'
    return data.canEnter ? !data.canEnter : true;
  }
  
}

export class ActionItem<T> {
  label: string;
  icon?: string;
  action: (item: T) => void;
  imageUrl?: string;
  viewAction?: boolean = true
}

export interface ColumnData {
  isImage?: boolean;
  text?: string;
  number?: number;
  boolean?: boolean;
  isDateTime?: boolean;
  icon?: string;
  isDate?: boolean;
  isStatus?: boolean;  // Add this to identify currency columns
  isText?: boolean;
  isTime?: boolean;
  isFulllDate?: boolean;
  isBoolean?: boolean;
}

export class Filters {
  text: string;
  dropdownValue: string;
  fromDate: string;
  toDate: string;
}