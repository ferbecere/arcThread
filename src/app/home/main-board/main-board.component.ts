import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CharacterListComponent } from '../characters/character-list/character-list.component';
import { EventListComponent } from '../events/event-list/event-list.component';
import { FactionListComponent } from '../factions/faction-list/faction-list.component';

import { CreateCardButtonComponent } from './create-card-button/create-card-button.component';
import { CardFormModalComponent } from './card-form-modal/card-form-modal.component';

import { CharactersService } from '../../../services/characters.service';
import { FactionsService } from '../../../services/factions.service';
import { EventService } from '../../../services/event.service';
import { Character } from '../../../models/character.model';
import { Event } from '../../../models/event.model';
import { Faction } from '../../../models/faction.model';

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

  characters: Character[] = [];
  factions: Faction[] = [];
  events: Event[] = [];

  constructor(
    private charactersService: CharactersService,
    private factionsService: FactionsService,
    private eventService: EventService

  ){}

  ngOnInit(){
    this.loadAll();
  }

  async loadAll(){
    this.characters = await this.charactersService.getCharacters();
    this.factions = await this.factionsService.getFactions();
    this.events = await this.eventService.getEvents();
    
  }

  openModal(type: 'character' | 'faction' | 'event'){
    this.modalType = type;
    this.showModal = true;
  };

  closeModal(){
    this.showModal = false;
  }

  async handleCreate(data: Character | Faction | Event){

    switch(this.modalType){
      case 'character':
        const newChar = await this.charactersService.addCharacter(data);
        this.characters.push(newChar);
        break;

      case 'faction':
        const factionData = {...data} as Faction & {
          alt_names?: string | string[];
          leaders?: string | string[];
          characters_associated?: string | string[];
        };

        if(typeof factionData.alt_names === 'string'){
          factionData.alt_names = factionData.alt_names.split(',').map((s:string)=>s.trim());
        }
        if(typeof factionData.leaders === 'string'){
          factionData.leaders = factionData.leaders.split(',').map((s:string)=> s.trim());
        }
        if(typeof factionData.characters_associated === 'string'){
          factionData.characters_associated = factionData.characters_associated.split(',').map((s:string)=>s.trim());
        }

        const newFaction = await this.factionsService.createFaction(factionData);
        this.factions.push(newFaction);
        break;
      
      case 'event':
        const newEvent = await this.eventService.addEvent(data);
        this.events.push(newEvent);
        break;
   

    }
  this.closeModal()
  }
}
