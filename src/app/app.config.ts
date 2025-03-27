import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true
    }),
    provideAnimations(),
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      const auth = getAuth(app);
      auth.settings.appVerificationDisabledForTesting = true;
      return app;
    }),
    provideAuth(() => {
      const auth = getAuth();
      auth.settings.appVerificationDisabledForTesting = true;
      return auth;
    }),
    provideFirestore(() => getFirestore())
  ]
};
