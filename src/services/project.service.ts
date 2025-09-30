import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Project, CreateProjectDto } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private supabase: SupabaseService) {}

  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Project | null;
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    const user = await this.supabase.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase.client
      .from('projects')
      .insert({
        ...project,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  }

  async updateProject(id: string, updates: Partial<CreateProjectDto>): Promise<Project> {
    const { data, error } = await this.supabase.client
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}