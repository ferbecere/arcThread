
import { CanvasEntity, Position } from './canvas-entity.model';

// Datos base de la facción (no cambian)
export interface FactionBase {
  id: string;
  project_id: string;
  name: string;
  symbol_url?: string;
  parent_id?: string;
  created_at?: string;
}

// Estado de la facción en un knot específico
export interface FactionSnapshot extends CanvasEntity {
  id: string;
  knot_id: string;
  faction_id: string;
  alt_names?: string[];
  description_culture?: string;
  description_territory?: string;
  description_technology?: string;
  motivation?: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// DTO para crear facción
export interface CreateFactionDto {
  // Base
  project_id: string;
  name: string;
  symbol_url?: string;
  parent_id?: string;
  
  // Primer snapshot
  knot_id: string;
  alt_names?: string[];
  description_culture?: string;
  description_territory?: string;
  description_technology?: string;
  motivation?: string;
  position?: Position;
}

// Vista completa de la facción (base + snapshot actual)
export interface Faction extends FactionBase, Omit<FactionSnapshot, 'id' | 'faction_id' | 'knot_id'> {
  type: 'faction';
  snapshot_id?: string;
}