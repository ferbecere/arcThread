export interface Position {
  x: number;
  y: number;
}

export interface CanvasEntity {
  position?: Position;
  colliding?: boolean;
  width?: number;
  height?: number;
}