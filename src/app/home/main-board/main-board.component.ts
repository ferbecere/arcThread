import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CharacterListComponent } from '../characters/character-list/character-list.component';
import { EventListComponent } from '../events/event-list/event-list.component';
import { FactionListComponent } from '../factions/faction-list/faction-list.component';

import { CreateCardButtonComponent } from './create-card-button/create-card-button.component';
import { CardFormModalComponent } from './card-form-modal/card-form-modal.component';

import { CharacterService } from '../../../services/characters.service';
import { FactionsService, Faction } from '../../../services/factions.service';
import { EventService } from '../../../services/event.service';

// import { CharacterCardComponent } from '../characters/character-card/character-card.component';
// import { WorldCardComponent } from '../worlds/world-card/world-card.component';
// import { EventNodeComponent } from '../events/event-node/event-node.component';

@Component({
  selector: 'app-main-board',
  standalone:true,
  imports: [CommonModule,CharacterListComponent,DragDropModule,FactionListComponent,EventListComponent,CreateCardButtonComponent,CardFormModalComponent],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent {

  showModal = false;
  modalType: 'character' | 'faction' | 'event' = 'character';

  characters: any[] = [];
  factions: Faction[] = [];
  events: any[] = [];


  constructor(
    private characterService: CharacterService,
    private factionService: FactionsService,
    private eventService: EventService

  ){}

  ngOnInit(){
    this.loadAll();
  }

  async loadAll(){
    this.characters = await this.characterService.getCharacters();
    this.factions = await this.factionService.getFactions();
    this.events = await this.eventService.getEvents();
    
  }



  openModal(type: 'character' | 'faction' | 'event'){
    this.modalType = type;
    this.showModal = true;
  };

  closeModal(){
    this.showModal = false;
  }

  async handleCreate(data: any){

    switch(this.modalType){
      case 'character':
        const createdChar = await this.characterService.addCharacter(data);
        this.characters = [...this.characters, ...createdChar];
        break;

      case 'faction':
        const createdFaction = await this.factionService.createFaction(data);
        this.factions = [...this.factions, createdFaction];
        break;
      
      case 'event':
        const createdEvent = await this.eventService.addEvent(data);
        this.events = [...this.events, ...createdEvent];
        break;
   

  }
 this.closeModal()
  }
}
