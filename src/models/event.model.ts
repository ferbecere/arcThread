import { CanvasEntity, Position } from './canvas-entity.model';

export interface Event extends CanvasEntity {
  type: 'event';
  id: string;
  knot_id: string;
  title: string;
  description?: string;
  key_event: boolean;
  is_persistent: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventDto {
  knot_id: string;
  title: string;
  description?: string;
  key_event?: boolean;
  is_persistent?: boolean;
  position?: Position;
}