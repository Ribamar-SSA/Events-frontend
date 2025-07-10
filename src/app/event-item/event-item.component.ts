import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppEvent } from '../models/event.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../events/event.service';
import { NgControl } from '@angular/forms';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-event-item',
  imports: [DatePipe, RouterLink],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'
})
export class EventItemComponent {
  @Input() appEvent!: AppEvent;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  @Output() eventDeleted = new EventEmitter<number>();

  constructor(
    private eventService: EventService

  ) {

  }


  onDeleteEvent(id: number) {
    if (confirm(`Tem certeza que deseja apagar o evento "${this.appEvent.title}"?`)) { // Adicione confirmação aqui
      this.eventService.destroyEvent(id).subscribe({
        next: () => {
          this.successMessage = 'Evento excluído com sucesso!';
          this.errorMessage = null; // Limpa qualquer erro anterior
          this.eventDeleted.emit(id); // NOVO: Emite o ID do evento deletado para o componente pai
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao deletar evento:', err);
          this.successMessage = null; // Limpa mensagem de sucesso
          this.errorMessage = `Não foi possível excluir o evento: ${err.error?.message || err.message || 'Erro desconhecido'}`;
        }
      });
    }
  }




}

