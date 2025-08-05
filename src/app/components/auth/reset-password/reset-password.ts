import { Component } from '@angular/core';
import { ResetPassword } from './reset-password.modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetService } from './reset.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPasswordComponent {

  restPassword:ResetPassword= new ResetPassword();
  isLoading: boolean = false;
showPassword :boolean=false;
  message:string=null;
  confirmPassword:string;



  constructor(private route: ActivatedRoute, private resetService :ResetService ,private router:Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.restPassword.email = params['email'] || '';
      this.restPassword.code = params['code'] || '';
    });
  }
  submitRest(resetForm :NgForm)
  {
    this.isLoading = true;
    if (resetForm.invalid) {
      this.isLoading = false;
      return
    }
    this.resetService.resetPassword(this.restPassword).subscribe(
      {
        next: (res) => { 
          if (res) {
            this.isLoading = false; // Set loading to false on success
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
        },
      }
    );
     
  }


togglePassword(){
  this.showPassword=!this.showPassword
}


 

  onPasswordChange(password: string) {
    if (this.restPassword.newPassword !== password) {
      this.message = "Passwords do not match!";
    } else {
      this.message = "";
    }
  }


}
