import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../events/event.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';

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
  currentUser: any;


  // Array para armazenar as categorias do backend
  categories: string[] = [];
  // Observable para sugestões de categoria (se usar input com datalist)
  filteredCategories$: Observable<string[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      speaker: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', Validators.required],
      category: ['', Validators.required],
      is_public: ['', Validators.required]
    });


    // Carregar as categorias ao inicializar o componente
    this.eventService.getCategories().subscribe({
      next: (data) => {
        this.categories = data; // Assumindo que a API retorna um array de strings
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        // Opcional: exibir uma mensagem de erro ou usar categorias padrão
        this.errorMessage = 'Não foi possível carregar as categorias. Tente novamente.';
      }
    });

    // Configura o autocompletar para o campo de categoria (se você decidir usar input com datalist)
    this.filteredCategories$ = this.eventForm.controls['category'].valueChanges.pipe(
      debounceTime(300), // Espera 300ms após a última digitação- reduz o número de operações desnecessárias
      distinctUntilChanged(), // Só emite se o valor for diferente do anterior
      switchMap(value => this.filterCategories(value || '')) // Filtra as categorias, se null ou undefined=>''
    );
  }




  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  private filterCategories(value: string): Observable<string[]> {
    const filterValue = value.toLowerCase();
    return of(this.categories.filter(category => category.toLowerCase().includes(filterValue)));
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.valid) {
      const formData = new FormData();
      formData.append('title', this.eventForm.value.title);
      formData.append('speaker', this.eventForm.value.speaker)
      formData.append('description', this.eventForm.value.description);
      formData.append('date', this.eventForm.value.date);
      formData.append('time', this.eventForm.value.time);
      formData.append('location', this.eventForm.value.location);
      formData.append('capacity', this.eventForm.value.capacity)
      formData.append('category', this.eventForm.value.category)
      formData.append('is_public', this.eventForm.get('is_public')?.value ? '1' : '0');


      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          console.log('Usuário autenticado. ID:', user);
          this.currentUser = user;
        } else {
          console.log('Usuário não autenticado.');
        }
      });
      formData.append('user_id', this.currentUser.user_id)


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
