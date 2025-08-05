import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';
import { Observable } from 'rxjs';
import { BackLogDays, UserCalendar, Parameters, parametersRequestArray } from './user-calendar/user-calendar.model';
import { CalendarDesc } from './calendar-description/calendar-description.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  controller: string = 'Calendar';

  constructor(private apiHlpr: HttpService) { }

  calendar = (): Observable<UserCalendar[]> => {
    return this.apiHlpr.get<UserCalendar[]>(`${this.controller}/settings`);
  }

  calendarUpdate = (calendar : UserCalendar[]): Observable<UserCalendar[]> => {
    return this.apiHlpr.put<UserCalendar[]>(`${this.controller}/settings/update` , calendar);
  }

  userWeek = (userId : string , startDate : string): Observable<UserCalendar[]> => {
    return this.apiHlpr.get<UserCalendar[]>(`${this.controller}/user/week` , {body : {userId : userId , startDate : startDate}});
  }

  updateUserWeek = (UserCalendar : UserCalendar[] , userId? : string): Observable<UserCalendar[]> => {
    return this.apiHlpr.put<UserCalendar[]>(`${this.controller}/user/week/${userId}` , UserCalendar);
  }
  



  // Calendar Description 
  getCalendarLookups = () : Observable<CalendarDesc[]> =>{
    return this.apiHlpr.get<CalendarDesc[]>(`CalendarDesLookup/get-all-days`);
  }

  getCalendarLookup = (id:number) : Observable<CalendarDesc> =>{
    return this.apiHlpr.get<CalendarDesc>(`CalendarDesLookup/get-day/${id}`);
  }

  addCalendarLookup= ( data : CalendarDesc) :Observable<CalendarDesc>=>{
    return this.apiHlpr.post<CalendarDesc>(`CalendarDesLookup/add-calendar-desc` , data);

  }
  deleteCalendarLookup= (id:number) :Observable<CalendarDesc>=>{
    return this.apiHlpr.delete<CalendarDesc>(`CalendarDesLookup/delete-day/${id}`);

  }

  updateCalendar= (calendarDesc :CalendarDesc) :Observable<CalendarDesc>=>{
    return this.apiHlpr.put<CalendarDesc>(`CalendarDesLookup/update-day/${calendarDesc.id}`, {description:calendarDesc.description});

  }

  getBacklogDays = () : Observable<Parameters>=>{
    return this.apiHlpr.get<Parameters>("system-parameters");
  }

  updateBackLogDay= (backLogDays :parametersRequestArray) :Observable<parametersRequestArray>=>{
    return this.apiHlpr.put<parametersRequestArray>(`system-parameters`, backLogDays);
  }
}
