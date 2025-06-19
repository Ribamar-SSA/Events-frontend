import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { RegisterComponent } from './register/register.component';
import { EventFormComponent } from './event-form/event-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Bem-vindo' }, // Página inicial
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Cadastro' },
  { path: 'events', component: EventListComponent, title: 'Eventos' }, // Lista de eventos
  { path: 'events/:id', component: EventDetailComponent, title: 'Detalhes do Evento' }, // Ver detalhes

  // Rotas Protegidas (precisam de autenticação) - Adicionaremos Guards futuramente
  { path: 'events/create', component: EventFormComponent, title: 'Criar Evento' },
  { path: 'events/:id/edit', component: EventFormComponent, title: 'Editar Evento' },

  // Rota curinga para caminhos não encontrados (deve ser a última rota)
  { path: '**', redirectTo: '' }




];
