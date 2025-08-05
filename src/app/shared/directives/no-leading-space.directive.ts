import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoLeadingSpace]'
})
export class NoLeadingSpaceDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = this.el.nativeElement.value;
    if (input.startsWith(' ')) {
      this.el.nativeElement.value = input.trimStart();
    }
  }
}
