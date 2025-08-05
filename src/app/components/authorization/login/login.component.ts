import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LogIn } from '../models/login.model';
import { LoginService } from './login.service';
import { Router, RouterModule } from '@angular/router';
import { SignalRService } from '../../../shared/services/signalR.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule ,RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userLogin: LogIn = new LogIn();
  isLoading: boolean = false;
  isRtl: boolean = false

  constructor(private loginService: LoginService, private router: Router ) { }

  showPassword: boolean = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}
  onSubmit(userForm: NgForm) {
    this.isLoading = true;

    if (userForm.invalid) {
      this.isLoading = false;
      return
    }

    localStorage.setItem('email', this.userLogin.email)

    this.loginService.login(this.userLogin).subscribe({
      next: (res) => {
        if (res) {
          this.loginService.setUser(res.token);
          this.isLoading = false; // Set loading to false on success
          this.router.navigate(['/pages/tasks']);
        }
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
}
