import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Character } from '../../../../models/character.model';
import { Faction } from '../../../../models/faction.model';
import { Event } from '../../../../models/event.model';

@Component({
  selector: 'app-card-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-form-modal.component.html',
  styleUrl: './card-form-modal.component.css'
})
export class CardFormModalComponent {
  @Input() type: 'character' | 'faction' | 'event'= 'character';
  @Output() create = new EventEmitter<Character | Faction | Event>();
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder){
  }

  ngOnInit(){
    this.initForm();
  }
  
  initForm(){

    switch(this.type){
      case 'character':
        this.form = this.fb.group({
            name: ['', Validators.required],
            alias: [''],
            avatar_url: [''],
            birthdate: [''],
            role: [''],
            personality_motivation:[''],
            biography_development: [''],
            appearance: ['']
          
      });
      break;

      case 'faction':
        this.form = this.fb.group({
            name: ['', Validators.required],
            alt_names: [[]],
            symbol_url: [''],
            description_culture: [''],
            description_territory: [''],
            description_technology: [''],
            motivation: [''],
            leaders: [[]],
            characters_associated: [[]],
          });
        break;

    case 'event':
      this.form = this.fb.group({
          title: ['', Validators.required],
          chapter: [''],
          year: [''],
          act: [''],
          description: [''],
          key_event: [false]
        });
      break;
    }
    
  }


  submitForm(){
    if(this.form.valid){
    this.create.emit(this.form.value);
    this.form.reset();
    }
  }

  cancel(){
    this.closed.emit();
    this.form.reset(); 
  }
}
