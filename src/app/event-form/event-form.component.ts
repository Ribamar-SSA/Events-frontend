import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../events/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {
  eventForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;


  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.valid) {
      const formData = new FormData();
      formData.append('title', this.eventForm.value.title);
      formData.append('description', this.eventForm.value.description);
      formData.append('date', this.eventForm.value.date);
      formData.append('time', this.eventForm.value.time);
      formData.append('location', this.eventForm.value.location);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.eventService.createEvent(formData).subscribe({
        next: (response) => {
          console.log('Evento criado com sucesso!', response);
          this.successMessage = 'Evento criado com sucesso!';
          this.eventForm.reset();
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Erro ao criar evento:', error);
          if (error.status === 422 && error.error && error.error.errors) {

            this.errorMessage = Object.values(error.error.errors).flat().join(' ');
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Ocorreu um erro ao criar o evento. Tente novamente.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

}
