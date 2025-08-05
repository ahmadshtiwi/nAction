import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './shared/interceptors/request.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../main';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HubConnectionBuilder } from '@microsoft/signalr';  // SignalR Client
import { SignalRService } from '../app/shared/services/signalR.service';  // Import your SignalR service


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes) ,
    provideHttpClient(withInterceptors([requestInterceptor])),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers,
    provideAnimations(), // Required for animations
    importProvidersFrom(ToastrModule.forRoot({
      timeOut: 3000, // Duration of the toast
      positionClass: 'toast-top-right', // Position of the toast
      preventDuplicates: true, // Prevent duplicate toasts
    })),
    SignalRService, // Assuming you have created a SignalR service to manage connections
  ]
};


