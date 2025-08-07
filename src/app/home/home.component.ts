import { Component } from '@angular/core';
import { EventService } from '../events/event.service';
import { AppEvent } from '../models/event.model';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    events: AppEvent[] = [];
    constructor(private eventService: EventService) { }


    ngOnInit(): void {
        this.eventService.getFeaturedEvents(5).subscribe((events) => {
            this.events = events;
        });
    }

}



