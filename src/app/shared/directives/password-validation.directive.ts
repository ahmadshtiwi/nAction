import {Directive, ElementRef, HostListener, Renderer2, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appPasswordValidation]'
})
export class PasswordValidationDirective implements OnInit {
  private validationContainer: HTMLDivElement;

  constructor(private el: ElementRef, private renderer: Renderer2 , private translationService : TranslateService) {
  }

  ngOnInit() {
  }

@HostListener('input', ['$event'])
onInput(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const password = inputElement.value;

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasCapitalCase = /[A-Z]/.test(password);
  const hasSmallCase = /[a-z]/.test(password);
  const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  this.updateValidationMessages(
    hasMinLength,
    hasNumber,
    hasCapitalCase,
    hasSmallCase,
    hasSpecialCharacters
  );
}

  @HostListener('focus')
  onFocus() {
    if (!this.validationContainer) {
      this.createValidationContainer();
    }
    this.showValidationContainer();
  }

  @HostListener('blur')
  onBlur() {
   this.hideValidationContainer();
  }

  private createValidationContainer() {
    this.validationContainer = this.renderer.createElement('span');
    this.renderer.addClass(this.validationContainer, 'password-validation-container');
    this.renderer.addClass(this.validationContainer, 'position-absolute');
    this.renderer.addClass(this.validationContainer, 'bg-white');
    this.renderer.addClass(this.validationContainer, 'border');
    this.renderer.addClass(this.validationContainer, 'h6');
    this.renderer.addClass(this.validationContainer, 'px-2');
    this.renderer.addClass(this.validationContainer, 'py-2');
    this.renderer.addClass(this.validationContainer, 'z-3');
    this.renderer.appendChild(this.el.nativeElement.parentElement, this.validationContainer);
  }

  private updateValidationMessages(
    hasMinLength: boolean,
    hasNumber: boolean,
    hasCapitalCase: boolean,
    hasSmallCase: boolean,
    hasSpecialCharacters: boolean
  ) {
    // Clear existing validation messages
    this.clearValidationMessages();

    // Add validation messages to the container
    this.addValidationMessage(hasMinLength, this.translationService.instant('Password must be at least 6 characters long.'));
    this.addValidationMessage(hasNumber, this.translationService.instant('Password must contain at least one number.'));
    this.addValidationMessage(hasCapitalCase, this.translationService.instant('Password must contain at least one uppercase letter.'));
    this.addValidationMessage(hasSmallCase, this.translationService.instant('Password must contain at least one lowercase letter.'));
    this.addValidationMessage(hasSpecialCharacters, this.translationService.instant('Password must contain at least one special character.'));
    

    // hide if all success ya m3lem
    if (hasMinLength && hasNumber && hasCapitalCase && hasSmallCase && hasSpecialCharacters) {
      this.hideValidationContainer();
    }else{
      this.showValidationContainer();
    }
  }

  private clearValidationMessages() {
    this.validationContainer.innerHTML = '';
  }

  private addValidationMessage(isValid: boolean, message: string) {
    const messageElement = this.renderer.createElement('div');
    this.renderer.addClass(messageElement, 'validation-message');
    if (isValid) {
      this.renderer.addClass(messageElement, 'text-success');
      messageElement.innerHTML = `<i class="fa fa-check-circle green"></i> ${message}`;
    } else {
      this.renderer.addClass(messageElement, 'text-danger');
      messageElement.innerHTML = `<i class="fa fa-times-circle red"></i> ${message}`;
    }
    this.renderer.appendChild(this.validationContainer, messageElement);
  }

  private showValidationContainer() {
    if (this.validationContainer) {
      this.renderer.setStyle(this.validationContainer, 'display', 'block');
    }
  }

  private hideValidationContainer() {
    this.renderer.setStyle(this.validationContainer, 'display', 'none');
  }
}
