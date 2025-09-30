import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Knot, CreateKnotDto } from '../../../models/knot.model';
import { KnotService } from '../../../services/knot.service';
import { KnotOperationsService } from '../../../services/knot-operations.service';
import { WorkspaceStateService } from '../../../services/workspace-state.service';

@Component({
  selector: 'app-time-thread',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-thread.component.html',
  styleUrl: './time-thread.component.css'
})
export class TimeThreadComponent implements OnInit {
  @Input() knots: Knot[] = [];
  @Input() currentKnot: Knot | null = null;
  @Output() knotSelected = new EventEmitter<Knot>();
  @Output() knotCreated = new EventEmitter<Knot>();
  @Output() knotDeleted = new EventEmitter<string>();

  // Modal para crear knot
  showCreateModal = false;
  newKnotTitle = '';
  newKnotChapter = '';
  newKnotDate = '';
  newKnotNotes = '';
  copyFromPrevious = true;
  
  loading = false;

  constructor(
    private knotService: KnotService,
    private knotOperations: KnotOperationsService,
    private workspaceState: WorkspaceStateService
  ) {}

  ngOnInit() {
    // Inicializar fecha por defecto (hoy)
    this.newKnotDate = new Date().toISOString().split('T')[0];
  }

  // Seleccionar knot
  selectKnot(knot: Knot): void {
    if (this.currentKnot?.id !== knot.id) {
      this.knotSelected.emit(knot);
    }
  }

  // Navegación anterior/siguiente
  goToPreviousKnot(): void {
    const currentIndex = this.knots.findIndex(k => k.id === this.currentKnot?.id);
    if (currentIndex > 0) {
      this.selectKnot(this.knots[currentIndex - 1]);
    }
  }

  goToNextKnot(): void {
    const currentIndex = this.knots.findIndex(k => k.id === this.currentKnot?.id);
    if (currentIndex < this.knots.length - 1) {
      this.selectKnot(this.knots[currentIndex + 1]);
    }
  }

  canGoPrevious(): boolean {
    const currentIndex = this.knots.findIndex(k => k.id === this.currentKnot?.id);
    return currentIndex > 0;
  }

  canGoNext(): boolean {
    const currentIndex = this.knots.findIndex(k => k.id === this.currentKnot?.id);
    return currentIndex >= 0 && currentIndex < this.knots.length - 1;
  }

  // Modal
  openCreateModal(): void {
    if (!this.workspaceState.currentProject) {
      alert('No active project');
      return;
    }

    // Prellenar con valores sugeridos
    this.newKnotTitle = `Knot ${this.knots.length + 1}`;
    this.newKnotChapter = `Chapter ${Math.floor(this.knots.length / 5) + 1}`;
    this.newKnotDate = new Date().toISOString().split('T')[0];
    this.newKnotNotes = '';
    this.copyFromPrevious = this.knots.length > 0; // Solo si hay knots previos
    
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Crear nuevo knot
  async createKnot(): Promise<void> {
    if (!this.newKnotTitle.trim() || !this.newKnotDate) {
      alert('Title and date are required');
      return;
    }

    const project = this.workspaceState.currentProject;
    if (!project) {
      alert('No active project');
      return;
    }

    this.loading = true;

    try {
      // Obtener el siguiente sequence_order
      const nextSequence = await this.knotService.getNextSequenceOrder(project.id);

      const dto: CreateKnotDto = {
        project_id: project.id,
        title: this.newKnotTitle.trim(),
        chapter: this.newKnotChapter.trim() || undefined,
        date: this.newKnotDate,
        sequence_order: nextSequence,
        notes: this.newKnotNotes.trim() || undefined
      };

      // Si hay que copiar del anterior, usar KnotOperationsService
      let newKnot: Knot;
      if (this.copyFromPrevious && this.currentKnot) {
        newKnot = await this.knotOperations.createKnotWithCopiedData(dto, this.currentKnot.id);
      } else {
        newKnot = await this.knotService.createKnot(dto);
      }

      this.knotCreated.emit(newKnot);
      this.closeCreateModal();

    } catch (err: any) {
      console.error('Error creating knot:', err);
      alert(err.message || 'Failed to create knot');
    } finally {
      this.loading = false;
    }
  }

  // Eliminar knot
  async deleteKnot(knot: Knot, event: Event): Promise<void> {
    event.stopPropagation(); // Evitar seleccionar el knot al eliminar

    if (this.knots.length === 1) {
      alert('Cannot delete the last knot. A project must have at least one knot.');
      return;
    }

    if (!confirm(`Delete knot "${knot.title}"? All characters, factions, and events in this knot will be lost.`)) {
      return;
    }

    this.loading = true;

    try {
      await this.knotService.deleteKnot(knot.id);
      this.knotDeleted.emit(knot.id);
    } catch (err: any) {
      console.error('Error deleting knot:', err);
      alert(err.message || 'Failed to delete knot');
    } finally {
      this.loading = false;
    }
  }

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Determinar si un knot tiene eventos clave (para hacerlo más grande)
  isKeyKnot(knot: Knot): boolean {
    // TODO: Esto podría mejorarse consultando si tiene eventos con key_event=true
    // Por ahora, simplemente basado en si está marcado externamente
    return false;
  }
}