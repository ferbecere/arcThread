import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../../../models/character.model';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-character-card',
  standalone:true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css'
})
export class CharacterCardComponent {
  @Input() item!: Character;

  @Output() dragEnd = new EventEmitter<{x:number, y:number, item:Character}>();

  onDragEnd(event:CdkDragEnd<any>){
      const pos = event.source.getFreeDragPosition();
      this.dragEnd.emit({x: pos.x, y: pos.y, item: this.item});
  }

}


