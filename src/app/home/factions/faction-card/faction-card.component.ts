import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-faction-card',
  imports: [CommonModule],
  templateUrl: './faction-card.component.html',
  styleUrl: './faction-card.component.css'
})
export class FactionCardComponent {
  @Input() name!: string;
  @Input() description?: string;
}


