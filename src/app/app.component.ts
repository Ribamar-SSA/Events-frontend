import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';


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

  
}
