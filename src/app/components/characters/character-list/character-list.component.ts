import { Component,Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CharactersService } from '../../../../services/characters.service';
import { CharacterCardComponent } from '../character-card/character-card.component';
import { Character } from '../../../../models/character.model';

@Component({
  selector: 'app-character-list',
  standalone:true,
  imports: [CommonModule,CharacterCardComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent {
  @Input() characters: Character[] = [];
  @Output() deleteCharacter = new EventEmitter<Character>();
  @Output() dragEnd = new EventEmitter<{x:number, y:number, item:Character}>();

  onDelete(character: Character){
    this.deleteCharacter.emit(character);
  }

  onDragEnd(event: {x:number, y:number, item:Character}){
    this.dragEnd.emit(event);
  }

}
