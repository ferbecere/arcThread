import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-world-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './world-card.component.html',
  styleUrl: './world-card.component.css'
})
export class WorldCardComponent {
  @Input() name!: string;
  @Input() description?: string;
}

