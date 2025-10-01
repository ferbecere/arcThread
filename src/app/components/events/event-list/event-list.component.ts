import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { EventService } from '../../../../services/event.service';
import { EventNodeComponent } from '../event-node/event-node.component';
import { Event as EventModel } from '../../../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventNodeComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent{
  @Input() events: EventModel[] = [];
  @Output() deleteEvent = new EventEmitter<EventModel>();
  @Output() dragEnd = new EventEmitter<any>();

  onDelete(event:EventModel){
    this.deleteEvent.emit(event);
  }

  onDragEnd(event:{x:number, y:number,item:EventModel}){
    this.dragEnd.emit(event);
  }

}
