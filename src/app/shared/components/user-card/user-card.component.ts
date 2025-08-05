import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../components/resource/user.model';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent   {
 

  @Input() cardData: User;
  @Input() actionItems: ActionItem<User>[];

  @Input() activeCardId: string | null = null;
  @Output() toggleMenu = new EventEmitter<string>();



  // Toggle function for displaying action menu
  onDropdownToggleClick(cardData: any): void {
  this.toggleMenu.emit(this.cardData.id); // ابعث ID البطاقة للـ parent
  }

  // Functions for handling the actions
  viewProfile(cacheData: User): void {
    console.log(cacheData);
  }

  editUser(): void {
    console.log('Editing user...');
  }

  removeUser(): void {
    console.log('Removing user...');
  } 

  executeAction(item: User, action: (item: User) => void) {
    action(item);
  }

  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  }
}
export class ActionItem<T> {
  label: string;
  icon?: string;
  action: (item: T) => void;
  imageUrl?: string;
  viewAction?: boolean = true
}