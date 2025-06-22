// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth/auth.interceptor'; // Caminho para seu interceptor
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent,{
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Registra o interceptor funcional aqui
    // Outros providers...
  ]
}).catch(err => console.error(err));
