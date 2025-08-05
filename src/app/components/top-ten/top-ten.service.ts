import { Observable } from "rxjs";
import { HttpService } from "../../shared/services/http.service";
import { TopResponse, TopTenReq } from "./top-ten.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class TopTenService {
      controller = 'Reports'
    
      constructor(private httpService: HttpService) { }
      
      getTopTen = (topTenReq:TopTenReq): Observable<TopResponse[]> => {
          
         return this.httpService.get<TopResponse[]>(`${this.controller}/TopTen`,{body:topTenReq});
       }

      
}