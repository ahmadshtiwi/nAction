import { Component, Input } from '@angular/core';
import { StatusEnum } from '../../models/enums';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrl: './badges.component.scss'
})
export class BadgesComponent {
  @Input() statuses : StatusEnum;
}
