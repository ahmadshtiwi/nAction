import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LogIn } from './login.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ForgetPasswordComponent } from "../forget-password/forget-password";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  // variables 
  userLogin: LogIn = new LogIn();
  isLoading: boolean = false;
  isRtl: boolean = false
  showPassword: boolean = false;
  showModal = false;


  constructor(private loginService: LoginService, private modalService: NgbModal, private router: Router, private spinner: SpinnerService) { }
  ngOnInit(): void {
    const token = this.loginService.getUser();
    if (token) {
      this.router.navigate(['/pages/tasks']);
    }
  }


  onSubmit(userForm: NgForm) {
    this.isLoading = true;

    if (userForm.invalid) {
      this.isLoading = false;
      return
    }

    localStorage.setItem('email', this.userLogin.email)

    this.spinner.show();

    this.loginService.login(this.userLogin).subscribe({
      next: (res) => {
        if (res) {
          this.loginService.setUser(res.token);
          this.isLoading = false; // Set loading to false on success
          this.spinner.hide();
          this.router.navigate(['/pages/tasks'], { replaceUrl: true });
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  openForgetPassword() {
    const modalRef = this.modalService.open(ForgetPasswordComponent);
    modalRef.result.then(
      (result) => {
        console.log('تم الإرسال لبريد:', result);
        // هنا ممكن تضيف منطق ارسال الطلب للخادم
      },
      (reason) => {
        console.log('تم إغلاق المودال');
      }
    );
  }
}
