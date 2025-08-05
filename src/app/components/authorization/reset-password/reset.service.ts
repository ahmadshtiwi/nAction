import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../assets/services/http.service';
import { ForgetPassword } from '../models/forget-password';
import { ResetPassword } from '../models/reset-password';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  calledRequests = [];

  constructor(private apiHlpr: HttpService) { }

  

  resetPassword  =(data:ResetPassword ) : Observable<ResetPassword> => {
    return this.apiHlpr.post<ResetPassword>("Auth/reset-password",data);
  }  



}
