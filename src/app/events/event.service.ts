// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Importação correta do catchError
import { AppEvent, PaginatedEventResponse } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) { }

  getEvents(pageNumber: number, searchTerm: string = ''): Observable<PaginatedEventResponse> {
    let params = new HttpParams().set('page', pageNumber.toString());

    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PaginatedEventResponse>(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Erro no EventService ao buscar eventos:', error);
        return throwError(() => new Error(`Falha na API ao buscar eventos: ${error.message || 'Erro desconhecido'}`));
      })
    );
  }

  getEventById(id: number): Observable<AppEvent> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<AppEvent>(url).pipe(
      catchError(error => {
        console.error(`Erro no EventService ao buscar evento ${id}:`, error);
        return throwError(() => new Error(`Falha na API ao buscar evento: ${error.message || 'Erro desconhecido'}`));
      })
    );
  }

  createEvent(formData: FormData): Observable<any> {
    console.log(formData);
    return this.http.post(`${this.apiUrl}/store`, formData, { withCredentials: true });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`, { withCredentials: true });
  }

  destroyEvent(id:number):Observable<any>{
    return this.http.delete<string[]>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro no EventService ao deletar evento ${id}:`, error);
        return throwError(() => new Error(`Falha na API ao deletar evento: ${error.message || 'Erro desconhecido'}`));
      })
    );
  }
}
