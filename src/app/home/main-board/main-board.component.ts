import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { CharacterCardComponent } from '../characters/character-card/character-card.component';
import { WorldCardComponent } from '../worlds/world-card/world-card.component';
import { EventNodeComponent } from '../events/event-node/event-node.component';

@Component({
  selector: 'app-main-board',
  standalone:true,
  imports: [CommonModule,CharacterCardComponent,DragDropModule,WorldCardComponent,EventNodeComponent],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent {
 @Input() characters: any[] = [];
 @Input() worlds: any[] = [];
 @Input() events: any[] = [];
}
