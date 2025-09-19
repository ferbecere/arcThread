import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-event-node',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './event-node.component.html',
  styleUrl: './event-node.component.css'
})
export class EventNodeComponent {
  @Input() title!: string ;
  @Input() chapter?: string = '';
  @Input() year?: string = '';
  @Input() description?: string = '';
  @Input() relevance?: boolean ;
  @Input() imageUrl?: string = '';
  @Input() act?: string = '';
}

