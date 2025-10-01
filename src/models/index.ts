export * from './canvas-entity.model';
export * from './project.model';
export * from './knot.model';
export * from './character.model';
export * from './faction.model';
export * from './event.model';
export * from './relationships.model';

import { Character } from './character.model';
import { Faction } from './faction.model';
import { Event } from '@angular/router';

// Tipo union para cualquier entidad del canvas
export type CanvasCard = Character | Faction | Event;