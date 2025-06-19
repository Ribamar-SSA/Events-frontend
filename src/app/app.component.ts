import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public authService: AuthService) {

  }


  title = 'hdevents-frontend';

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Erro ao tentar sair:', err);
      }
    });

  }
}
