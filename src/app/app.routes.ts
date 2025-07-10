import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventFormComponent } from './event-form/event-form.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventItemComponent } from './event-item/event-item.component';


//qual componente deve ser exibido quando a rota for ativada
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, title: 'Bem-vindo' },
  { path: 'events', component: EventListComponent, title: 'Eventos' },
  { path: 'events/create', component: EventFormComponent, title: 'Criar Evento' },
  { path: 'events/:id', component: EventDetailComponent, title: 'Detalhes do Evento' },

  // Rotas Protegidas (precisam de autenticação) - Adicionaremos Guards futuramente
  { path: 'events/:id/edit', component: EventFormComponent, title: 'Editar Evento' },
  { path: 'events/detroy/:id', component: EventListComponent, title: 'Apagar Evento' },




  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
