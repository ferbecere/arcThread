
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';

import { CharacterListComponent } from '../characters/character-list/character-list.component';
import { EventListComponent } from '../events/event-list/event-list.component';
import { FactionListComponent } from '../factions/faction-list/faction-list.component';
import { CreateCardButtonComponent } from './create-card-button/create-card-button.component';
import { CardFormModalComponent } from './card-form-modal/card-form-modal.component';

import { CharactersService } from '../../../services/characters.service';
import { FactionsService } from '../../../services/factions.service';
import { EventService } from '../../../services/event.service';
import { WorkspaceStateService } from '../../../services/workspace-state.service';
import { CanvasStateService } from '../../../services/canvas-state.service';

import { Character, CreateCharacterDto } from '../../../models/character.model';
import { Event as EventModel, CreateEventDto } from '../../../models/event.model';
import { Faction, CreateFactionDto } from '../../../models/faction.model';
import { Knot } from '../../../models/knot.model';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-main-board',
  standalone: true,
  imports: [
    CommonModule,
    CharacterListComponent,
    DragDropModule,
    FactionListComponent,
    EventListComponent,
    CreateCardButtonComponent,
    CardFormModalComponent
  ],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.css'
})
export class MainBoardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estado del workspace
  currentProject: Project | null = null;
  currentKnot: Knot | null = null;

  // Modal
  showModal = false;
  modalType: 'character' | 'faction' | 'event' = 'character';

  // Datos del canvas
  characters: Character[] = [];
  factions: Faction[] = [];
  events: EventModel[] = [];

  // UI states
  loading = false;
  error: string | null = null;
  selectedItem: Character | Faction | EventModel | null = null;
  showDetailsPanel = false;

  constructor(
    private charactersService: CharactersService,
    private factionsService: FactionsService,
    private eventService: EventService,
    private workspaceState: WorkspaceStateService,
    private canvasState: CanvasStateService
  ) {}

  ngOnInit() {
    // Suscribirse a cambios de proyecto y knot
    this.workspaceState.currentProject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(project => {
        this.currentProject = project;
      });

    this.workspaceState.currentKnot$
      .pipe(takeUntil(this.destroy$))
      .subscribe(knot => {
        this.currentKnot = knot;
        if (knot) {
          this.loadKnotData(knot.id);
        }
      });

    // Suscribirse al estado del canvas
    this.canvasState.characters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(chars => this.characters = chars);

    this.canvasState.factions$
      .pipe(takeUntil(this.destroy$))
      .subscribe(factions => this.factions = factions);

    this.canvasState.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => this.events = events);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar datos del knot actual
  private async loadKnotData(knotId: string): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const [characters, factions, events] = await Promise.all([
        this.charactersService.getCharactersInKnot(knotId),
        this.factionsService.getFactionsInKnot(knotId),
        this.eventService.getEventsInKnot(knotId)
      ]);

      // Asignar posiciones por defecto si no las tienen
      const charsWithPos = characters.map((c, i) => ({
        ...c,
        position: c.position ?? { x: 50 + i * 120, y: 50 }
      }));

      const factionsWithPos = factions.map((f, i) => ({
        ...f,
        position: f.position ?? { x: 100 + i * 150, y: 200 }
      }));

      const eventsWithPos = events.map((e, i) => ({
        ...e,
        position: e.position ?? { x: 200 + i * 100, y: 400 }
      }));

      // Actualizar estado del canvas
      this.canvasState.setCharacters(charsWithPos);
      this.canvasState.setFactions(factionsWithPos);
      this.canvasState.setEvents(eventsWithPos);

      this.canvasState.checkCollisions();

    } catch (err: any) {
      console.error('Error loading knot data:', err);
      this.error = err.message || 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }

  // ===== DRAG & DROP =====
  onDragEnd(event: { x: number; y: number; item: any }) {
    const newPosition = { x: event.x, y: event.y };
    event.item.position = newPosition;

    // Actualizar posición en base de datos según el tipo
    switch (event.item.type) {
      case 'character':
        if (event.item.snapshot_id) {
          this.charactersService.updateCharacterPosition(event.item.snapshot_id, newPosition);
          this.canvasState.updateCharacter(event.item.id, { position: newPosition });
        }
        break;

      case 'faction':
        if (event.item.snapshot_id) {
          this.factionsService.updateFactionPosition(event.item.snapshot_id, newPosition);
          this.canvasState.updateFaction(event.item.id, { position: newPosition });
        }
        break;

      case 'event':
        this.eventService.updateEventPosition(event.item.id, newPosition);
        this.canvasState.updateEvent(event.item.id, { position: newPosition });
        break;
    }

    this.canvasState.checkCollisions();
  }

  // ===== MODAL =====
  openModal(type: 'character' | 'faction' | 'event'): void {
    if (!this.currentKnot || !this.currentProject) {
      alert('No active knot. Please select or create a knot first.');
      return;
    }
    this.modalType = type;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ===== CREAR ENTIDADES =====
  async handleCreate(data: any): Promise<void> {
    if (!this.currentKnot || !this.currentProject) {
      alert('No active knot');
      return;
    }

    this.loading = true;

    try {
      switch (this.modalType) {
        case 'character':
          await this.createCharacter(data);
          break;

        case 'faction':
          await this.createFaction(data);
          break;

        case 'event':
          await this.createEvent(data);
          break;
      }

      this.closeModal();
    } catch (err: any) {
      console.error('Error creating item:', err);
      alert(err?.message || 'Error creating item');
    } finally {
      this.loading = false;
    }
  }

  private async createCharacter(data: any): Promise<void> {
    const dto: CreateCharacterDto = {
      project_id: this.currentProject!.id,
      knot_id: this.currentKnot!.id,
      name: data.name,
      birthdate: data.birthdate || undefined,
      alias: data.alias || undefined,
      avatar_url: data.avatar_url || undefined,
      role: data.role || undefined,
      personality_motivation: data.personality_motivation || undefined,
      biography_development: data.biography_development || undefined,
      appearance: data.appearance || undefined,
      position: {
        x: 50 + this.characters.length * 120,
        y: 50
      }
    };

    const newChar = await this.charactersService.createCharacter(dto);
    this.canvasState.addCharacter(newChar);
  }

  private async createFaction(data: any): Promise<void> {
    // Procesar arrays si vienen como strings
    let alt_names = data.alt_names;
    if (typeof alt_names === 'string' && alt_names.trim()) {
      alt_names = alt_names.split(',').map((s: string) => s.trim());
    } else if (!Array.isArray(alt_names)) {
      alt_names = undefined;
    }

    const dto: CreateFactionDto = {
      project_id: this.currentProject!.id,
      knot_id: this.currentKnot!.id,
      name: data.name,
      symbol_url: data.symbol_url || undefined,
      parent_id: data.parent_id || undefined,
      alt_names: alt_names,
      description_culture: data.description_culture || undefined,
      description_territory: data.description_territory || undefined,
      description_technology: data.description_technology || undefined,
      motivation: data.motivation || undefined,
      position: {
        x: 100 + this.factions.length * 150,
        y: 200
      }
    };

    const newFaction = await this.factionsService.createFaction(dto);
    this.canvasState.addFaction(newFaction);
  }

  private async createEvent(data: any): Promise<void> {
    const dto: CreateEventDto = {
      knot_id: this.currentKnot!.id,
      title: data.title,
      description: data.description || undefined,
      key_event: data.key_event || false,
      is_persistent: false, // Por defecto no es persistente
      position: {
        x: 200 + this.events.length * 100,
        y: 400
      }
    };

    const newEvent = await this.eventService.createEvent(dto);
    this.canvasState.addEvent(newEvent);
  }

  // ===== ELIMINAR ENTIDADES =====
  async handleDeleteCharacter(character: Character): Promise<void> {
    if (!confirm(`Delete character "${character.name}"?`)) return;

    try {
      // Aquí decides: ¿eliminar el character base (todas las apariciones)?
      // O solo ocultar el snapshot actual?
      
      // Opción 1: Ocultar solo en este knot
      if (character.snapshot_id) {
        await this.charactersService.hideCharacter(character.snapshot_id);
        this.canvasState.removeCharacter(character.id);
      }

      // Opción 2: Eliminar completamente (descomentar si prefieres esto)
      // await this.charactersService.deleteCharacter(character.id);
      // this.canvasState.removeCharacter(character.id);

    } catch (err) {
      console.error('Error deleting character:', err);
      alert('Failed to delete character');
    }
  }

  async handleDeleteFaction(faction: Faction): Promise<void> {
    if (!confirm(`Delete faction "${faction.name}"?`)) return;

    try {
      if (faction.snapshot_id) {
        await this.factionsService.hideFaction(faction.snapshot_id);
        this.canvasState.removeFaction(faction.id);
      }
    } catch (err) {
      console.error('Error deleting faction:', err);
      alert('Failed to delete faction');
    }
  }

  async handleDeleteEvent(event: EventModel): Promise<void> {
    if (!confirm(`Delete event "${event.title}"?`)) return;

    try {
      await this.eventService.deleteEvent(event.id);
      this.canvasState.removeEvent(event.id);
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    }
  }

  // ===== DETALLES (Right sidebar) =====
  openDetails(item: Character | Faction | EventModel) {
    this.selectedItem = item;
    this.showDetailsPanel = true;
    this.canvasState.selectCard(item);
  }

  closeDetails() {
    this.selectedItem = null;
    this.showDetailsPanel = false;
    this.canvasState.selectCard(null);
  }
}