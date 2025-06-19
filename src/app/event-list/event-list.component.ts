import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { EventItemComponent } from '../event-item/event-item.component';
import { AppEvent, PaginatedEventResponse } from '../models/event.model';


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



  private apiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) { }



  ngOnInit(): void {
    //o signal permite usar como se fosse o método
    this.fetchEvents(this.currentPage());
  }

  fetchEvents(pageNumber: number, searchTerm: string = ''): void {
    this.message.set('Carregando eventos...');
    this.error.set(null);

    let url = `${this.apiUrl}?page=${pageNumber}`;
    if (searchTerm) {
      url += `&search=${searchTerm}`;
    }


    this.http.get<PaginatedEventResponse>(url)
      .pipe(
        catchError(err => {
          console.error('Erro na requisição da API:', err);
          this.error.set(`Erro ao carregar eventos: ${err.message || err.statusText || 'Erro desconhecido'}`);
          this.message.set('Falha ao carregar dados.');
          return throwError(() => new Error('Erro na API ao buscar eventos.'));
        })
      )
      .subscribe(response => {
        this.events.set(response.data);
        this.currentPage.set(response.current_page);
        this.lastPage.set(response.last_page);

        this.paginationLinks.set(response.links.filter(link =>
          link.url !== null && link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;'
        ));


        this.message.set(`Dados carregados com sucesso! ${this.events().length} eventos nesta página (total: ${response.total}).`);
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
