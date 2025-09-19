import { Component, OnInit } from '@angular/core';
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
import { Event as EventModel } from '../../../models/event.model';
import { Faction } from '../../../models/faction.model';


@Component({
  selector: 'app-main-board',
  standalone:true,
  imports: [
    CommonModule,
    CharacterListComponent,
    DragDropModule,
    FactionListComponent,
    EventListComponent,
    CreateCardButtonComponent,
    CardFormModalComponent],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent implements OnInit {

  showModal = false;
  modalType: 'character' | 'faction' | 'event' = 'character';

  selectedItem: Character | Faction | EventModel | null = null;
  showDetailsPanel = false;


  characters: Character[] = [];
  factions: Faction[] = [];
  events: EventModel[] = [];

    loading = false;
    error: string | null = null;

  constructor(
    private charactersService: CharactersService,
    private factionsService: FactionsService,
    private eventService: EventService
  ){}

   async ngOnInit() {
    await this.loadAll();
  }

  private async loadAll(): Promise<void>{

    this.loading=true;
    this.error= null;

  try {
        [this.characters, this.factions, this.events] = await Promise.all([
        this.charactersService.getCharacters(),
        this.factionsService.getFactions(),
        this.eventService.getEvents()
      ]);
      } catch (err:any) {
        console.error('Error loading data', err);
      }finally {
        this.loading = false;
      }
  }

  //creation modal. 

  openModal(type: 'character' | 'faction' | 'event'):void{
    this.modalType = type;
    this.showModal = true;
  };

  closeModal(){
    this.showModal = false;
  }



  //Handlers 1- crear.

  async handleCreate(data: Character | Faction | EventModel){
    try{
    switch(this.modalType){
      case 'character':
        const newChar = await this.charactersService.addCharacter(data as Character);
        this.characters = [...this.characters, newChar];
        break;

      case 'faction':
        const factionData = {...(data as Faction)} as Faction &
         { alt_names?: string | string[];
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
        this.factions = [...this.factions, newFaction];
        break;
      
      case 'event':
        const newEvent = await this.eventService.addEvent(data as EventModel);
        this.events = [...this.events, newEvent];
        break;
   
      }
    } catch (err: any){
      console.error('error creting Item',err);
      alert(err?.message || 'error Creating Item');
    }finally{
  this.closeModal()
      
    }

  }

 //2- delete by ID.

  async handleDeleteCharacter(character:Character):Promise<void>{
    try{
    await this.charactersService.deleteCharacter(character.id!);
    this.characters = this.characters.filter(c => c.id !== character.id);
    }catch(err){
      console.error('Error deleting character',err);
      alert('Failed to delete character');
    }
  }

  async handleDeleteFaction(faction:Faction):Promise<void>{
    try{
    await this.factionsService.deleteFaction(faction.id!);
    this.factions = this.factions.filter(f => f.id !== faction.id);
  }catch(err){
      console.error('Error deleting faction',err);
      alert('Failed to delete faction');
    }
  }

  async handleDeleteEvent(event:EventModel){
    try{
    await this.eventService.deleteEvent(event.id!);
    this.events = this.events.filter(e => e.id !== event.id);
  }catch(err){
      console.error('Error deleting event',err);
      alert('Failed to delete event');
    }
  }


  //edits and details by object. will be shown at rigth column.

    openDetails(item: Character | Faction | EventModel) {
    this.selectedItem = item;
    this.showDetailsPanel = true;
  }

  closeDetails() {
    this.selectedItem = null;
    this.showDetailsPanel = false;
  }

}
