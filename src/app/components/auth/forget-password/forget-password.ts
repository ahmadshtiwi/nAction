import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgetService } from './forget-password.service';
import { ForgetPassword } from './forget-password.model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss'
})
export class ForgetPasswordComponent {
  email = '';
  forgetPassword: ForgetPassword = new ForgetPassword();


  constructor(public activeModal: NgbActiveModal, private router: Router, private modalService: NgbModal, private forgetService: ForgetService) { }

  submit() {
    if (this.email) {


      this.activeModal.close(this.email);
    }

  }


  submitForget(forgetForm: any) {
    this.forgetPassword.email = this.email;
    if (forgetForm.invalid) {
      this.activeModal.close(this.email);
      return
    }

    this.forgetService.forgetPassword(this.forgetPassword).subscribe({
      next: (res) => {
        if (res) {

          const modalRef = this.modalService.open(ModalComponent, {
            windowClass: 'custom-modal-center',
            modalDialogClass: 'custom-modal-content custom-modal-size'
          });
          modalRef.componentInstance.message = 'Please Check Your Email To Confirm';
          modalRef.componentInstance.isDeleteAction = false;

          this.activeModal.close(this.email);

          this.router.navigate(["/"]);

        }
      },
      error: (err) => {
      this.activeModal.close(this.email);

      },
    });


  }
}

