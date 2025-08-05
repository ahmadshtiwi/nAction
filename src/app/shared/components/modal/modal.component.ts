import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule, NgbModalModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
 
  @Input() message: string = '';
  isDeleteAction: boolean = false;

  constructor(public activeModal: NgbActiveModal) { }

  close(confirmed: boolean) {
    this.activeModal.close(confirmed);
  }
}
