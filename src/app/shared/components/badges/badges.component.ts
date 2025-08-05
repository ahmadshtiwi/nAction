import { Component, Input, OnChanges } from '@angular/core';
import { StatusEnum } from '../../models/enums';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.scss'
})
export class BadgesComponent  implements OnChanges {
  @Input() statuses?: StatusEnum;
  @Input() statusName?: string;

  statusValue!: StatusEnum;

  ngOnChanges(): void {
    if (this.statuses) {
      this.statusValue = this.statuses;
    } else if (this.statusName) {
      if(this.statusName=='Approved Completed')
        this.statusName='ApprovedCompleted'
      this.statusValue = StatusEnum[this.statusName];
    }
  }

}
