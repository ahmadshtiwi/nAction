import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictNonNumeric]'
})
export class RestrictNonNumericDirective {

  private allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];

  @HostListener('keydown', ['$event'])
  restrictNonNumeric(event: KeyboardEvent): void {
    if (this.allowedKeys.includes(event.key) || (event.key >= '0' && event.key <= '9')) {
      return;
    } else {
      event.preventDefault();
    }
  }
}
