import { Component, Inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class AppLoaderComponent {

  isLoaderOnScreen: boolean = false;

  constructor(private spinnnerService: SpinnerService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.bindSpinnerChanges();
  }

  bindSpinnerChanges() {
    this.spinnnerService.subject.subscribe((value) => {
      console.log('value', value);
      value ? this.document.body.style.overflow = 'hidden' : this.document.body.style.overflow = 'auto' ;
      this.isLoaderOnScreen = value;
    });
  }
  
}
