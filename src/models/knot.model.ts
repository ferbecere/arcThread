export interface Knot {
  id: string;
  project_id: string;
  title: string;
  chapter?: string;
  date: string; // ISO date string
  sequence_order: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateKnotDto {
  project_id: string;
  title: string;
  chapter?: string;
  date: string;
  sequence_order: number;
  notes?: string;
}