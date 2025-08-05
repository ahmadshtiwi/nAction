import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { Observable } from 'rxjs';
import {  TopResponse, TopTenReq } from './top-ten.modal';
import { HttpParams } from '@angular/common/http';

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