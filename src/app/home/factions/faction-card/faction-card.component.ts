import { Component,Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Faction } from '../../../../models/faction.model';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-faction-card',
  imports: [CommonModule, CdkDrag ],
  templateUrl: './faction-card.component.html',
  styleUrl: './faction-card.component.css'
})
export class FactionCardComponent {
  @Input() item! : Faction;

  @Output() dragEnd = new EventEmitter<{x:number, y:number, item:Faction}>();

  onDragEnd(event: CdkDragEnd){
    const pos = event.source.getFreeDragPosition();
    this.dragEnd.emit({x:pos.x, y:pos.y, item: this.item});
  }

}

