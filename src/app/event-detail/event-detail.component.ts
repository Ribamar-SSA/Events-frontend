import { Component, Input, OnInit } from '@angular/core';
import { AppEvent } from '../models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService } from '../events/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  imports: [DatePipe, CommonModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit {


  event: AppEvent | undefined;
  errorMessage: string | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,) { }


  ngOnInit(): void {

    this.route.paramMap.pipe(

      switchMap(params => {
        const idString = params.get('id');
        if (idString) {
          const id = +idString;
          this.errorMessage = null;
          return this.eventService.getEventById(id);
        } else {

          this.errorMessage = 'ID do evento não fornecido na rota.';
          return new Observable<AppEvent>();
        }
      })
    ).subscribe({
      next: (event) => {
        this.event = event;
        if (!event) {
          this.errorMessage = 'Evento não encontrado.';
        }
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do evento:', err);
        this.errorMessage = `Não foi possível carregar os detalhes do evento: ${err.message || 'Erro desconhecido'}`;
        this.event = undefined;
      }
    });
  }


  goBack(): void {
    this.router.navigate(['/events']);
  }
}
