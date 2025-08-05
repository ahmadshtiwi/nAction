import { Injectable } from "@angular/core";
import { HttpService } from "../../../shared/services/http.service";
import { Observable } from "rxjs";
import { ForgetPassword } from "./forget-password.model";

@Injectable({
    providedIn:'root'
})

export class ForgetService {

  calledRequests = [];

  constructor(private apiHlpr: HttpService) { }

  

  forgetPassword  =(data:ForgetPassword ) : Observable<ForgetPassword> => {
    return this.apiHlpr.post<ForgetPassword>("Auth/forget-password",data);
  }  



}
