// src/app/event-form/event-form.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../events/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AppEvent } from '../models/event.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs'; // Adicionado Observable para o user_id

@Component({
    selector: 'app-event-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './event-form.component.html',
    styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit { // Implementado OnInit
    eventId: number | null = null;
    isEditMode: boolean = false;
    imagePreview: string | ArrayBuffer | null = null;
    eventForm!: FormGroup;
    errorMessage: string | null = null; // Alterado para 'null' para melhor tratamento
    successMessage: string | null = null; // Alterado para 'null' para melhor tratamento
    selectedFile: File | null = null;
    currentUser: any;


    constructor(
        private fb: FormBuilder,
        private eventService: EventService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();

        this.route.paramMap.subscribe(params => {
            const idParam = params.get('id');
            if (idParam) {
                this.eventId = +idParam; // Converte para número
                this.isEditMode = true;
                this.loadEventData(this.eventId); // Carrega os dados para preencher o formulário
            }
        });

        this.authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.currentUser = user;
                console.log('Usuário autenticado. ID:', user);
            } else {
                this.currentUser = null;
                console.log('Usuário não autenticado.');
            }
        });
    }

    initForm(): void {
        this.eventForm = this.fb.group({
            title: ['', Validators.required],
            speaker: ['', Validators.required],
            description: ['', Validators.required],
            date: ['', Validators.required],
            time: ['', Validators.required],
            location: ['', Validators.required],
            capacity: ['', [Validators.required, Validators.min(1)]],
            category: ['', Validators.required],
            is_public: [false, Validators.required]
        });
    }

    loadEventData(id: number): void {
        this.eventService.getEventById(id).subscribe(
            {
                next: (event: AppEvent) => {
                    // Assume que a sua API retorna a data e hora do evento em uma propriedade 'event_date'
                    const eventDateTime = event.event_date ? new Date(event.event_date) : null;

                    const formattedDate = eventDateTime ? eventDateTime.toISOString().split('T')[0] : '';
                    const formattedTime = eventDateTime ? eventDateTime.toTimeString().split(' ')[0].substring(0, 5) : '';

                    this.eventForm.patchValue({
                        title: event.title,
                        speaker: event.speaker,
                        description: event.description,
                        date: formattedDate,
                        time: formattedTime,
                        location: event.location,
                        capacity: event.capacity,
                        category: event.category,
                        is_public: event.is_public
                    });

                    if (event.image_url) {
                        this.imagePreview = `${event.image_url}`;
                    }
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Erro ao carregar dados do evento:', err);
                    this.errorMessage = `Falha ao carregar evento: ${err.message || 'Erro desconhecido'}`;
                }
            }
        )
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = e => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);

        } else {
            this.selectedFile = null;
            this.imagePreview = null;
        }
    }


    onSubmit(): void {
        this.errorMessage = null;
        this.successMessage = null;

        if (this.eventForm.invalid) {
            this.errorMessage = 'Por favor, preencha todos os campos obrigatórios e válidos.';
            this.eventForm.markAllAsTouched();
            return;
        }

        const formData = new FormData();
        Object.keys(this.eventForm.value).forEach(key => {
            if (key === 'is_public') {
                formData.append(key, this.eventForm.get(key)?.value ? '1' : '0');
            } else {
                formData.append(key, this.eventForm.get(key)?.value);
            }
        });

        if (this.currentUser && this.currentUser.user_id) {
            formData.append('user_id', this.currentUser.user_id);
        } else {
            this.errorMessage = 'Erro: Usuário não autenticado. Não é possível enviar o evento.';
            console.error('Erro: currentUser ou user_id não disponível ao tentar submeter o formulário.');
            return;
        }


        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        if (this.isEditMode && this.eventId) {

            this.eventService.updateEvent(this.eventId, formData).subscribe({
                next: (response) => {
                    console.log('Evento atualizado com sucesso!', response);
                    this.successMessage = 'Evento atualizado com sucesso!';
                    this.router.navigate(['/events', this.eventId]);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Erro ao atualizar evento:', err);
                    if (err.status === 422 && err.error && err.error.errors) {
                        this.errorMessage = Object.values(err.error.errors).flat().join(' ');
                    } else if (err.error && err.error.message) {
                        this.errorMessage = err.error.message;
                    } else {
                        this.errorMessage = 'Ocorreu um erro ao atualizar o evento. Tente novamente.';
                    }
                }
            });
        } else {
            this.eventService.createEvent(formData).subscribe({
                next: (response) => {
                    console.log('Evento criado com sucesso!', response);
                    this.successMessage = 'Evento criado com sucesso!';
                    this.eventForm.reset();
                    this.selectedFile = null;
                    this.imagePreview = null;
                    this.router.navigate(['/events', response.event.id]);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Erro ao criar evento:', err);
                    if (err.status === 422 && err.error && err.error.errors) {
                        this.errorMessage = Object.values(err.error.errors).flat().join(' ');
                    } else if (err.error && err.error.message) {
                        this.errorMessage = err.error.message;
                    } else {
                        this.errorMessage = 'Ocorreu um erro ao criar o evento. Tente novamente.';
                    }
                }
            });
        }
    }
}
