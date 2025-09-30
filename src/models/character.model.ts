
import { CanvasEntity, Position } from './canvas-entity.model';

// Datos base del personaje (no cambian)
export interface CharacterBase {
  id: string;
  project_id: string;
  name: string;
  birthdate?: string;
  created_at?: string;
}

// Estado del personaje en un knot específico
export interface CharacterSnapshot extends CanvasEntity {
  id: string;
  knot_id: string;
  character_id: string;
  alias?: string;
  avatar_url?: string;
  role?: string;
  personality_motivation?: string;
  biography_development?: string;
  appearance?: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// DTO para crear personaje (incluye datos base + primer snapshot)
export interface CreateCharacterDto {
  // Base
  project_id: string;
  name: string;
  birthdate?: string;
  
  // Primer snapshot (se creará automáticamente)
  knot_id: string;
  alias?: string;
  avatar_url?: string;
  role?: string;
  personality_motivation?: string;
  biography_development?: string;
  appearance?: string;
  position?: Position;
}

// Vista completa del personaje (base + snapshot actual)
export interface Character extends CharacterBase, Omit<CharacterSnapshot, 'id' | 'character_id' | 'knot_id'> {
  type: 'character';
  snapshot_id?: string; // ID del snapshot actual
}