import { Injectable } from "@angular/core";
import { HttpService } from "../../../shared/services/http.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class HeaderService 
{
      constructor(private httpService: HttpService) { }
    
      

    getImageProfile = (): Observable<string> => {
        return this.httpService.get<string>(`Users/image-profile`);
    }
      
}