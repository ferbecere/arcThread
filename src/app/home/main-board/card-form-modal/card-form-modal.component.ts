import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-form-modal.component.html',
  styleUrl: './card-form-modal.component.css'
})
export class CardFormModalComponent {
  @Input() type: 'character' | 'faction' | 'event'= 'character';
  @Output() create = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({});
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
          role: ['secundario'],
          status: ['activo'],
          gender_identity: [''],
          birthdate: [''],
          birthdate_approx: [false],
          personality: [''],
          biography: [''],
          development: [''],
          motivation: [''],
          conflict: [''],
          appearance: [''],
          profession: [''],
          origin: [''],
          motto: [''],
          inventory: [[]],
          power_level: [''],
          secret: [''],
          chronology_notes: ['']
      });
      break;

    case 'faction':
      this.form = this.fb.group({
          name: ['', Validators.required],
          alt_names: [[]],
          type: [''],
          symbol_url: [''],
          description: [''],
          culture: [''],
          history: [''],
          politics: [''],
          economy: [''],
          territory: [''],
          technology: [''],
          motto: [''],
          religion: [''],
          laws: [''],
          narrative_role: [''],
          current_conflict: [''],
          motivation: ['']
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
