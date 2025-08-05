import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoLeadingSpace]'
})
export class NoLeadingSpaceDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) 
  onInputChange(event:Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input.startsWith(' ')) {
     (event.target as HTMLInputElement).value = input.trimStart();
    }
  }
}


