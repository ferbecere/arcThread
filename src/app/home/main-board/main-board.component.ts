import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CharacterListComponent } from '../characters/character-list/character-list.component';
import { EventListComponent } from '../events/event-list/event-list.component';
import { FactionListComponent } from '../factions/faction-list/faction-list.component';

import { CreateCardButtonComponent } from './create-card-button/create-card-button.component';
import { CharacterService } from '../../../services/characters.service';

// import { CharacterCardComponent } from '../characters/character-card/character-card.component';
// import { WorldCardComponent } from '../worlds/world-card/world-card.component';
// import { EventNodeComponent } from '../events/event-node/event-node.component';

@Component({
  selector: 'app-main-board',
  standalone:true,
  imports: [CommonModule,CharacterListComponent,DragDropModule,FactionListComponent,EventListComponent,CreateCardButtonComponent],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent {

  characters: any[] = [];
  constructor(private characterService: CharacterService){}

  onCreate(type: string) {
     if (type === 'character') {
      // Abrir formulario/modal de nuevo personaje
      console.log('Abrir formulario para crear personaje');
      // Aquí puedes mostrar un modal o un componente de formulario
    } else if (type === 'faction') {
      console.log('Abrir formulario para crear facción');
    } else if (type === 'event') {
      console.log('Abrir formulario para crear evento');
    }

}
}