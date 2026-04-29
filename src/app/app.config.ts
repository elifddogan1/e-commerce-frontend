import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor])
    ),
    providePrimeNG({
        theme: {
            preset: Aura, // Temayı burada tanımlıyoruz
            options: {
                darkModeSelector: '.my-app-dark' // Opsiyonel
            }
        }
    }),
    provideNgxStripe('pk_test_51TRZWwRMOSr5NPkDz2QzTAO9ewvMGyDJDjJBS1gAmqQHqSSyOOQy9tjfkxqJfvURz9q1esrJJLaCbYSLRsg2Jbgu00neNFcCgM')
  ]
};
