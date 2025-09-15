import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-card-button',
  imports: [CommonModule],
  templateUrl: './create-card-button.component.html',
  styleUrl: './create-card-button.component.css'
})
export class CreateCardButtonComponent {
  @Output() create = new EventEmitter<string>();


  expanded = false;

  toggleMenu(){
    this.expanded = !this.expanded;
  }

  createCharacter(){
    this.create.emit('character');
    this.expanded = false;
  }

  createFaction(){
    this.create.emit('faction');
    this.expanded = false;
  }

  createEvent(){
    this.create.emit('event');
    this.expanded = false;
  }


}



