import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxValue]'
})
export class MaxValueDirective {
  @Input('appMaxValue') maxValue: number;
  @Input('appMinValue') minValue: number;

  constructor() { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    
    if (value > this.maxValue) {
      value = this.maxValue;
      input.value = value.toString(); // Reset the value to the max allowed
    }
    
    if (value < this.minValue) {
      value = this.minValue;
      input.value = value.toString(); // Reset the value to the max allowed
    }
  }
}
