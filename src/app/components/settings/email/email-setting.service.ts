import { Injectable } from "@angular/core";
import { HttpService } from "../../../shared/services/http.service";
import { EmailSetting } from "./email.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmailSettingService {

  private controller:string='EmailSetting';
  constructor(private httpService:HttpService) { }

  getSystemEmail=():Observable<EmailSetting>=>{
    return this.httpService.get(`${this.controller}/system`)
  }
  
  getUsersEmail=():Observable<EmailSetting[]>=>{
    return this.httpService.get(`${this.controller}`)
  }
  
updateUserEmail=(emailSetting:EmailSetting):Observable<EmailSetting>=>{
  return this.httpService.put(`${this.controller}`,emailSetting);
}

updateSystemEmail=(emailSetting:EmailSetting):Observable<EmailSetting>=>{
  return this.httpService.put(`${this.controller}/system`,emailSetting);
}


}
