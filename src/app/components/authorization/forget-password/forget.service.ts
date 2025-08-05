import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../assets/services/http.service';
import { ForgetPassword } from '../models/forget-password';

@Injectable({
  providedIn: 'root'
})
export class ForgetService {

  calledRequests = [];

  constructor(private apiHlpr: HttpService) { }

  

  forgetPassword  =(data:ForgetPassword ) : Observable<ForgetPassword> => {
    return this.apiHlpr.post<ForgetPassword>("Auth/forget-password",data);
  }  



}
