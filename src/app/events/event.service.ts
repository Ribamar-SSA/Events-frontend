import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }


  private apitUrl= 'http://localhost:8000/api/events';

  
}
