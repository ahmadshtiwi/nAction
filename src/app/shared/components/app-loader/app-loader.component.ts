import { Component, DOCUMENT, Inject } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-app-loader',
  standalone: true,
  imports: [],
  templateUrl: './app-loader.component.html',
  styleUrl: './app-loader.component.scss'
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
      value ? this.document.body.style.overflow = 'hidden' : this.document.body.style.overflow = 'auto' ;
      this.isLoaderOnScreen = value;
    });
  }
}
