import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-card',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css'
})
export class CharacterCardComponent {
  @Input() name: string = '';
  @Input() alias?: string = '';
  @Input() avatarUrl?: string = '';
  @Input() role?: string = '';
  @Input() birthdate?:string = '';
  @Input() personalityMotivation?: string = '';
  @Input() biographyDevelopment?: string = '';
  @Input() appearance?:string = '';
}


