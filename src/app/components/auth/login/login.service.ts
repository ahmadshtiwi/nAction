import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { AccessToken, LoggedInUser, LogIn, Password } from './login.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpService :HttpService) { }


  login=(user:LogIn):Observable<LoggedInUser>=>{
    return this.httpService.post<LoggedInUser>('Auth',user)
  }

  changePassword = (obj: Password): Observable<LoggedInUser> => {
    return this.httpService.put<LoggedInUser>(`Account/change-password`, obj);
  }

  setUser = (accessToken: string): void => localStorage.setItem("_accessToken", accessToken);

  isLoggedIn = (): boolean => !!localStorage.getItem("_accessToken");

  getUser = (): AccessToken | null => this.isLoggedIn() ? (this.decodeToken()) as unknown as AccessToken : null;

  decodeToken = () =>  this.isLoggedIn() ? jwtDecode(this.getAccessToken()!) as AccessToken : null;

  getAccessToken = (): string | null => localStorage.getItem("_accessToken");

}
