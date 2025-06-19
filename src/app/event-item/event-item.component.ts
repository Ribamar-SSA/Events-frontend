import { Component, Input } from '@angular/core';
import { AppEvent } from '../models/event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-item',
  imports: [DatePipe],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'
})
export class EventItemComponent {
  @Input() appEvent!: AppEvent;
}
