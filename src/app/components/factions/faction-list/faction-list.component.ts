import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FactionsService } from '../../../../services/factions.service';
import { FactionCardComponent } from '../faction-card/faction-card.component';
import { Faction } from '../../../../models/faction.model';


@Component({
  selector: 'app-faction-list',
  standalone:true,
  imports: [CommonModule, FactionCardComponent],
  templateUrl: './faction-list.component.html',
  styleUrl: './faction-list.component.css'
})
export class FactionListComponent {

  @Input() factions: Faction[]=[];
  @Output() deleteFaction = new EventEmitter<Faction>();
  @Output() dragEnd = new EventEmitter<{x:number, y:number, item:Faction}>();

  onDelete(f:Faction){
    this.deleteFaction.emit(f);
  }

  onDragEnd(event:{x:number, y:number, item:Faction}){
    this.dragEnd.emit(event);
  }

}
