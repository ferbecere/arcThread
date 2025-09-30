export * from './canvas-entity.model';
export * from './project.model';
export * from './knot.model';
export * from './character.model';
export * from './faction.model';
export * from './event.model';
export * from './relationships.model';

// Tipo union para cualquier entidad del canvas
export type CanvasCard = Character | Faction | Event;