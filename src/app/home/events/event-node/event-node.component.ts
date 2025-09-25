import { Component,EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event as EventModel } from '../../../../models/event.model';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-event-node',
  standalone:true,
  imports: [CommonModule, CdkDrag],
  templateUrl: './event-node.component.html',
  styleUrl: './event-node.component.css'
})
export class EventNodeComponent {
  @Input() item!: EventModel;

  @Output() dragEnd = new EventEmitter<{x:number, y:number, item:EventModel}>();

  onDragEnd(event:CdkDragEnd){
    const pos = event.source.getFreeDragPosition();
    this.dragEnd.emit({x:pos.x, y:pos.y, item: this.item});
  }

}

