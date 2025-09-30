import { Injectable } from '@angular/core';
import { KnotService } from './knot.service';
import { CharactersService } from './characters.service';
import { FactionsService } from './factions.service';
import { EventService } from './event.service';
import { CreateKnotDto, Knot } from '../models/knot.model';

@Injectable({
  providedIn: 'root'
})
export class KnotOperationsService {
  constructor(
    private knotService: KnotService,
    private charactersService: CharactersService,
    private factionsService: FactionsService,
    private eventService: EventService
  ) {}

  /**
   * Crea un nuevo knot y copia todos los snapshots del knot anterior
   */
  async createKnotWithCopiedData(dto: CreateKnotDto, sourceKnotId?: string): Promise<Knot> {
    // 1. Crear el nuevo knot
    const newKnot = await this.knotService.createKnot(dto);

    // 2. Si hay knot de origen, copiar datos
    if (sourceKnotId) {
      await this.copyAllDataToNewKnot(sourceKnotId, newKnot.id);
    }

    return newKnot;
  }

  /**
   * Copia todos los snapshots y eventos persistentes de un knot a otro
   */
  async copyAllDataToNewKnot(sourceKnotId: string, targetKnotId: string): Promise<void> {
    try {
      // Obtener todas las entidades del knot origen
      const [characters, factions, events] = await Promise.all([
        this.charactersService.getCharactersInKnot(sourceKnotId),
        this.factionsService.getFactionsInKnot(sourceKnotId),
        this.eventService.getEventsInKnot(sourceKnotId)
      ]);

      // Copiar snapshots de personajes
      const characterCopies = characters.map(char =>
        this.charactersService.copySnapshotToNewKnot(char.id, sourceKnotId, targetKnotId)
      );

      // Copiar snapshots de facciones
      const factionCopies = factions.map(faction =>
        this.factionsService.copySnapshotToNewKnot(faction.id, sourceKnotId, targetKnotId)
      );

      // Copiar eventos persistentes
      const eventCopy = this.eventService.copyPersistentEventsToNewKnot(sourceKnotId, targetKnotId);

      await Promise.all([...characterCopies, ...factionCopies, eventCopy]);
    } catch (error) {
      console.error('Error copying data to new knot:', error);
      throw error;
    }
  }

  /**
   * Obtiene el knot anterior más cercano para usar como fuente de copia
   */
  async getPreviousKnotForCopy(projectId: string, currentSequence: number): Promise<Knot | null> {
    const { data, error } = await this.knotService['supabase'].client
      .from('knots')
      .select('*')
      .eq('project_id', projectId)
      .lt('sequence_order', currentSequence)
      .order('sequence_order', { ascending: false })
      .limit(1)
      .single();
    
    if (error) return null;
    return data as Knot;
  }
}