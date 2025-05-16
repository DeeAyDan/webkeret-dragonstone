import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dragonstone-11f9a',
        appId: '1:229598369493:web:e224c5a44ca933dc91b45c',
        storageBucket: 'dragonstone-11f9a.firebasestorage.app',
        apiKey: 'AIzaSyCvDKROtbsTt-0e5I6Jpx7XWz8-1RiJoF0',
        authDomain: 'dragonstone-11f9a.firebaseapp.com',
        messagingSenderId: '229598369493',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
