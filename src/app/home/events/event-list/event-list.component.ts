import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../services/event.service';
import { EventNodeComponent } from '../event-node/event-node.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventNodeComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit{
  events:any[] = [];
  loading= false;
  error: string | null = null;
  
  constructor(private eventService: EventService){}

  async ngOnInit(){
      this.loading = true;
      try{
       this.events = await this.eventService.getEvents();
      } catch (err:any){
        this.error = err.message || 'Some error loading event cards';
      } finally {
        this.loading = false;
      }
  }

}
