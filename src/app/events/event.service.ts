// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Importação correta do catchError
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

    getFeaturedEvents(limit: number = 10): Observable<AppEvent[]> {
        const params = new HttpParams().set('limit', limit.toString());

        return this.http.get<PaginatedEventResponse>(this.apiUrl, { params }).pipe(
            map(response => response.data),

            catchError(error => {
                console.error('Erro ao buscar eventos para o carrossel:', error);
                return throwError(() => new Error(`Falha na API ao buscar eventos em destaque: ${error.message || 'Erro desconhecido'}`));
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

    destroyEvent(id: number): Observable<any> {
        return this.http.delete<string[]>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.error(`Erro no EventService ao deletar evento ${id}:`, error);
                return throwError(() => new Error(`Falha na API ao deletar evento: ${error.message || 'Erro desconhecido'}`));
            })
        );
    }

    updateEvent(id: number, formData: FormData): Observable<any> {
        const url = `${this.apiUrl}/${id}`
        formData.append('_method', 'PUT');

        return this.http.post(url, formData, { withCredentials: true }).pipe(
            catchError(error => {
                console.error(`Erro no EventService ao atualizar evento ${id}:`, error);
                return throwError(() => new Error(`Falha na API ao atualizar evento: ${error.message || 'Erro desconhecido'}`));
            })
        );

    }
}
