import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmailSetting } from './email.model';
import { EmailSettingService } from './email-setting.service';

@Component({
  selector: 'app-email',
  imports: [FormsModule,CommonModule],
  templateUrl: './email.html',
  styleUrl: './email.scss'
})
export class Email implements  OnInit{
  
  forgetpassword:boolean;
  systemEmailSetting=new EmailSetting();
  usersEmailSetting:EmailSetting[]=[];
  constructor(private emailSettingService:EmailSettingService){}
  ngOnInit(): void {

    this.getSystemSetting();
    this.getUsersSetting();
    
  }
submitEmailSettings()
{
 this.emailSettingService.updateUserEmail(this.systemEmailSetting).subscribe(res=>{
    if(res)
    {
      this.getSystemSetting();
    }
  });
}


getSystemSetting()
{
  this.emailSettingService.getSystemEmail().subscribe(res=>{
    if(res)
    {
      this.systemEmailSetting=res;
    }
  });
}

getUsersSetting()
{
  this.emailSettingService.getUsersEmail().subscribe(res=>{
    if(res)
    {
      this.usersEmailSetting=res;
    }
  });
}

updateUserEmailSetting(data:EmailSetting){
  this.emailSettingService.updateUserEmail(data).subscribe(res=>{
    if(res)
    {
      this.getUsersSetting();
    }
  });
}

// updateUserEmailSetting(data:EmailSetting){
//   this.emailSettingService.updateUserEmail(data).subscribe(res=>{
//     if(res)
//     {
//       this.getUsersSetting();
//     }
//   });
// }
}
