import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../assets/services/http.service';
import { HourlyCost, HourlyCostProcudre } from './hourly-cost..model';

@Injectable({
  providedIn: 'root'
})

export class HourlyCostService {
      controller = 'HourlyCost'
    
      constructor(private httpService: HttpService) { }
      
     getHourlyCost = ( userId:string) :Observable<HourlyCost[]>=>{
       return this.httpService.get<HourlyCost[]>(`${this.controller}`,{body:{userId}});
     }
      
     getHourlyCostById = (id:number) :Observable<HourlyCost>=>{
      return this.httpService.get<HourlyCost>(`${this.controller}/${id}`);
    }
     addHourlyCost=(hourlyCost:HourlyCost) :Observable<HourlyCost>=>{
      return this.httpService.post<HourlyCost>(`${this.controller}`,hourlyCost) ;
     }

     updateHourlyCost=(hourlyCost:HourlyCost) :Observable<HourlyCost>=>{
      return this.httpService.put<HourlyCost>(`${this.controller}/${hourlyCost.id}`,hourlyCost) ;
     }

     deleteHourlyCost=(id:number) :Observable<HourlyCost>=>{
      return this.httpService.delete<HourlyCost>(`${this.controller}/${id}`) ;
     }
     getTotalHourlyCost =(userId:string):Observable<HourlyCostProcudre>=>{
      return this.httpService.get<HourlyCostProcudre>(`${this.controller}/GetTotal`,{body:{userId}});

     }
}