import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../models/reset-password';
import { ResetService } from './reset.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  restPassword:ResetPassword= new ResetPassword();
  isLoading: boolean = false;

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





 

  onPasswordChange(password: string) {
    if (this.restPassword.newPassword !== password) {
      this.message = "Passwords do not match!";
    } else {
      this.message = "";
    }
  }


}
