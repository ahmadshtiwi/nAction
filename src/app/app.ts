import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLoaderComponent } from "./shared/components/app-loader/app-loader.component";
import { SpinnerService } from './shared/services/spinner.service';
import { Login } from "./components/auth/login/login";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App  {
  protected title = 'new_nAction';


}
