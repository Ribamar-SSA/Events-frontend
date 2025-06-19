// src/app/models/event.model.ts

export interface AppEvent {
  id: number;
  created_at: string; // Ou Date, se você for converter
  updated_at: string; // Ou Date, se você for converter
  title: string;
  user_id: number;
  speaker: string;
  description: string;
  event_date: string; // Ou Date, se você for converter
  location: string;
  capacity: number;
  is_public: number; // ou boolean, dependendo da sua lógica
  category: string;
  image: string;
  // Adicione outras propriedades específicas do seu evento aqui
}

export interface PaginatedEventResponse {
  current_page: number;
  data: AppEvent[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
