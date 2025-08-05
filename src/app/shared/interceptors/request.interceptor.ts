import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
 
 
  const alertService = inject(AlertService); // Inject AlertService

  // Retrieve the token from localStorage
  const token = localStorage.getItem('_accessToken');

  // Get the user's time zone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Clone the request and add headers
  const modifiedRequest = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if it exists
      'Time-Zone': timeZone, // Always add the user's time zone
    },
  });

  // Pass the modified request and handle any errors
  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log the error to the console
      console.error('Interceptor error:', error.message || error.statusText);

      // Show error message using AlertService
      if (error.error?.errors?.length) {
        alertService.error(error.error.errors[1], error.error.errors[0]);
      } else {
        alertService.error('An unexpected error occurred.');
      }

      // Re-throw the error
      return throwError(() => error);
    })
  );
};
