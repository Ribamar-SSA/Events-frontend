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
    // 1. Assina as mudanças no 'paramMap' para obter o ID da rota
    this.route.paramMap.pipe(
      // 2. Usa switchMap para "trocar" o Observable do paramMap
      // pelo Observable retornado pelo método getEventById do serviço.
      switchMap(params => {
        const idString = params.get('id'); // Obtém o ID como string
        if (idString) {
          const id = +idString; // Converte a string do ID para número
          this.errorMessage = null; // Limpa qualquer erro anterior
          // Chama o serviço para buscar o evento pelo ID
          return this.eventService.getEventById(id);
        } else {
          // Se não houver ID na rota, retorna um Observable vazio ou com erro
          this.errorMessage = 'ID do evento não fornecido na rota.';
          return new Observable<AppEvent>(); // Retorna um Observable vazio para não quebrar a cadeia
        }
      })
    ).subscribe({
      next: (event) => {
        this.event = event; // Atribui o evento encontrado
        if (!event) {
          this.errorMessage = 'Evento não encontrado.'; // Caso o ID seja válido mas o evento não exista
        }
      },
      error: (err) => {
        // Captura erros da requisição HTTP do serviço
        console.error('Erro ao carregar detalhes do evento:', err);
        this.errorMessage = `Não foi possível carregar os detalhes do evento: ${err.message || 'Erro desconhecido'}`;
        this.event = undefined; // Garante que nenhum evento parcial seja exibido
      }
    });
  }


  goBack(): void {
    this.router.navigate(['/events']);
  }
}
