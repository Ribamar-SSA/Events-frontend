// src/app/app.config.ts (ou similar)
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // <-- Importe provideRouter
import { routes } from './app.routes'; // <-- Importe suas rotas (ex: app.routes.ts)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth/auth.interceptor'; // Importe seu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // <-- **MUITO IMPORTANTE: Prover o roteador aqui**
    provideHttpClient(withInterceptors([authInterceptor])),
    // Outros provedores...
  ]
};
