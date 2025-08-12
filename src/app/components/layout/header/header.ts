import { Component, OnInit, TemplateRef } from '@angular/core';
import { LoginService } from '../../auth/login/login.service';
import {  CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AccessToken, Password } from '../../auth/login/login.model';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  password: Password = new Password();
  isAdmin: boolean;
  showConfirmationError: boolean;
  isSidebarOpen: boolean;
  username:string;
  showCurrentPassword=false; 
  showNewPassword=false; 
  showReNewPassword=false; 
  imageProfilePath:string;
  constructor(private loginService :LoginService,private headerService:HeaderService,private location : Location,private router: Router,private offcanvasService: NgbOffcanvas){}

  
  ngOnInit(): void {
  
    this.username=this.loginService.getUser().given_name;
    
    this.headerService.getImageProfile().subscribe(res=>{ 
      if(res)
      { 
        this.imageProfilePath=res["imageUrl"];
      }
    })
  }


  back()
  {
        this.location.back()


  }

    checkConfirmPassword() {
    if (this.password.confirmPassword != this.password.newPassword) {
      this.showConfirmationError = true;
    } else {
      this.showConfirmationError = false;
    }
  }


    submitRequest(form: NgForm) {
    if (form.invalid || this.showConfirmationError) {
      return
    }
    this.loginService.changePassword(this.password).subscribe(res => {
      if (res) {
        this.offcanvasService.dismiss();
      }
    })
  }
    logout() {
    localStorage.clear();
    this.router.navigate(['/'])
  }
  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end', panelClass: 'custom-offcanvas' });
  }

  toggleCurrentPassword()
  {
    this.showCurrentPassword = !this.showCurrentPassword;
    
  }
  
  toggleNewPassword()
  {
    
    this.showNewPassword = !this.showNewPassword;
}

toggleReNewPassword(){
  
  this.showReNewPassword = !this.showReNewPassword;
  }
}
