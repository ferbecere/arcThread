export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
}