
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-card-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-form-modal.component.html',
  styleUrl: './card-form-modal.component.css'
})
export class CardFormModalComponent implements OnInit {
  @Input() type: 'character' | 'faction' | 'event' = 'character';
  @Output() create = new EventEmitter<any>(); // Cambiado a any porque enviamos DTOs
  @Output() closed = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    switch (this.type) {
      case 'character':
        this.form = this.fb.group({
          name: ['', Validators.required],
          alias: [''],
          avatar_url: [''],
          birthdate: [''],
          role: [''],
          personality_motivation: [''],
          biography_development: [''],
          appearance: ['']
        });
        break;

      case 'faction':
        this.form = this.fb.group({
          name: ['', Validators.required],
          alt_names: [''], // String, se convertirá a array en el componente padre
          symbol_url: [''],
          parent_id: [''],
          description_culture: [''],
          description_territory: [''],
          description_technology: [''],
          motivation: ['']
          // Nota: leaders y characters_associated se gestionarán después mediante
          // las tablas de relaciones (faction_leaders, faction_members)
        });
        break;

      case 'event':
        this.form = this.fb.group({
          title: ['', Validators.required],
          description: [''],
          key_event: [false]
        });
        break;
    }
  }

  submitForm() {
    if (this.form.valid) {
      this.create.emit(this.form.value);
      this.form.reset();
    }
  }

  cancel() {
    this.closed.emit();
    this.form.reset();
  }
}