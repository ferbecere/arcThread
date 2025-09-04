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
  @Input() title!: string;
  @Input() description?: string;
  @Input() imageUrl?: string;
}

