import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ForgetPassword } from '../models/forget-password';
import { Router } from '@angular/router';
import { ForgetService } from './forget.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forget-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
forgetPassword : ForgetPassword = new ForgetPassword() ;
isLoading: boolean = false;

res:any;

constructor( private loginService :ForgetService ,private router :Router ,private modalService : NgbModal )

{}

submitForget(forgetForm:any)
{

  this.isLoading = true;

  if (forgetForm.invalid) {
    this.isLoading = false;
    return
  }

  this.loginService.forgetPassword(this.forgetPassword).subscribe({
    next: (res) => {
      if (res) {

        const modalRef = this.modalService.open(ModalComponent, {
              windowClass: 'custom-modal-center',
              modalDialogClass: 'custom-modal-content custom-modal-size'
            });
            modalRef.componentInstance.message = 'Please Check Your Email To Confirm';
            modalRef.componentInstance.isDeleteAction = false;
            // modalRef.result.then((res: boolean) => {
            //   if (res) {
            //     this.taskService.deleteTask(item.id).subscribe(res => {
            //       if(res){
            //         this.getData()
            //       }
            //      })
            //   }
            // })

        this.router.navigate(["/"]);
        
        }
    },
    error: (err) => {
      this.isLoading = false;
    },
  });


}

}
