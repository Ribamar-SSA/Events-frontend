import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EventItemComponent } from '../event-item/event-item.component';
import { AppEvent, PaginatedEventResponse } from '../models/event.model';
import { EventService } from '../events/event.service';


@Component({
  selector: 'app-event-list',
  imports: [CommonModule, EventItemComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {

  events = signal<AppEvent[]>([]);
  message = signal('Carregando eventos...');
  error = signal<string | null>(null);
  currentPage = signal(1);
  lastPage = signal(1);
  paginationLinks = signal<{ url: string | null; label: string; active: boolean }[]>([]);


  constructor(private eventService: EventService) { }



  ngOnInit(): void {
    this.fetchEvents(this.currentPage());
  }

  fetchEvents(pageNumber: number, searchTerm: string = ''): void {
    this.message.set('Carregando eventos...');
    this.error.set(null);

    this.eventService.getEvents(pageNumber, searchTerm)
      .subscribe({
        next: response => {
          this.events.set(response.data);
          this.currentPage.set(response.current_page);
          this.lastPage.set(response.last_page);
          this.paginationLinks.set(response.links.filter(link =>
            link.url !== null && link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
          ));
          this.message.set(`Dados carregados com sucesso! ${this.events().length} eventos nesta página (total: ${response.total}).`);
        },
        error: err => {
          console.error('Erro no componente ao carregar eventos:', err);
          this.error.set(`${err.message || 'Erro desconhecido'}`);
          this.message.set('Falha ao carregar dados.');
        }
      });

  }


  onSearch(searchTerm: string): void {
    this.fetchEvents(1, searchTerm);
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.fetchEvents(page);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.fetchEvents(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.lastPage()) {
      this.fetchEvents(this.currentPage() + 1);
    }

  }



}
