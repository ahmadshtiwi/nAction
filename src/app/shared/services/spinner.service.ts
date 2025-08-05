import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  subject: Subject<boolean> = new Subject<boolean>();
  spinnersStack: Date[] = [];
  constructor() { }

  show = () => {
    this.spinnersStack.push(new Date());
    this.subject.next(true);
  }

  hide = () => {
    this.spinnersStack.pop();
    this.subject.next(false);
  }}
