import { Injectable } from "@angular/core";
import { HttpService } from "../../shared/services/http.service";
import { Observable } from "rxjs";
import { CalendarDescription } from "./calendar-description/calendar-description.model";
import { parametersRequestArray,Parameters } from "./paramter/parameter.model";
import { UserCalendar } from "./calendar/calendar.model";


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
  getCalendarLookups = () : Observable<CalendarDescription[]> =>{
    return this.apiHlpr.get<CalendarDescription[]>(`CalendarDesLookup/get-all-days`);
  }

  getCalendarLookup = (id:number) : Observable<CalendarDescription> =>{
    return this.apiHlpr.get<CalendarDescription>(`CalendarDesLookup/get-day/${id}`);
  }

  addCalendarLookup= ( data : CalendarDescription) :Observable<CalendarDescription>=>{
    return this.apiHlpr.post<CalendarDescription>(`CalendarDesLookup/add-calendar-desc` , data);

  }
  deleteCalendarLookup= (id:number) :Observable<CalendarDescription>=>{
    return this.apiHlpr.delete<CalendarDescription>(`CalendarDesLookup/delete-day/${id}`);

  }

  updateCalendar= (CalendarDescription :CalendarDescription) :Observable<CalendarDescription>=>{
    return this.apiHlpr.put<CalendarDescription>(`CalendarDesLookup/update-day/${CalendarDescription.id}`, CalendarDescription);

  }

  getBacklogDays = () : Observable<Parameters>=>{
    return this.apiHlpr.get<Parameters>("system-parameters");
  }

  updateBackLogDay= (backLogDays :parametersRequestArray) :Observable<parametersRequestArray>=>{
    return this.apiHlpr.put<parametersRequestArray>(`system-parameters`, backLogDays);
  }
}
