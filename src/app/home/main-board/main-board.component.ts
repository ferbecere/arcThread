import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { WorldCardComponent } from '../world-card/world-card.component';
import { EventNodeComponent } from '../event-node/event-node.component';

@Component({
  selector: 'app-main-board',
  standalone:true,
  imports: [CommonModule,CharacterCardComponent,WorldCardComponent,EventNodeComponent],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent {
 @Input() characters: any[] = [];
 @Input() worlds: any[] = [];
 @Input() events: any[] = [];
}
