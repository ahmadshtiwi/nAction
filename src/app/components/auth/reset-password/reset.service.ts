import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../shared/services/http.service';
import { ResetPassword } from './reset-password.modal';


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
