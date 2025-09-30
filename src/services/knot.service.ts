import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Knot, CreateKnotDto } from '../models/knot.model';

@Injectable({
  providedIn: 'root'
})
export class KnotService {
  constructor(private supabase: SupabaseService) {}

  async getKnots(projectId: string): Promise<Knot[]> {
    const { data, error } = await this.supabase.client
      .from('knots')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence_order', { ascending: true });
    
    if (error) throw error;
    return data as Knot[];
  }

  async getKnotById(id: string): Promise<Knot | null> {
    const { data, error } = await this.supabase.client
      .from('knots')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Knot | null;
  }

  async createKnot(knot: CreateKnotDto): Promise<Knot> {
    const { data, error } = await this.supabase.client
      .from('knots')
      .insert(knot)
      .select()
      .single();
    
    if (error) throw error;
    return data as Knot;
  }

  async updateKnot(id: string, updates: Partial<CreateKnotDto>): Promise<Knot> {
    const { data, error } = await this.supabase.client
      .from('knots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Knot;
  }

  async deleteKnot(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('knots')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Navegación entre knots
  async getNextKnot(currentKnotId: string): Promise<Knot | null> {
    const current = await this.getKnotById(currentKnotId);
    if (!current) return null;

    const { data, error } = await this.supabase.client
      .from('knots')
      .select('*')
      .eq('project_id', current.project_id)
      .gt('sequence_order', current.sequence_order)
      .order('sequence_order', { ascending: true })
      .limit(1)
      .single();
    
    if (error) return null;
    return data as Knot;
  }

  async getPreviousKnot(currentKnotId: string): Promise<Knot | null> {
    const current = await this.getKnotById(currentKnotId);
    if (!current) return null;

    const { data, error } = await this.supabase.client
      .from('knots')
      .select('*')
      .eq('project_id', current.project_id)
      .lt('sequence_order', current.sequence_order)
      .order('sequence_order', { ascending: false })
      .limit(1)
      .single();
    
    if (error) return null;
    return data as Knot;
  }

  // Obtener el siguiente sequence_order disponible
  async getNextSequenceOrder(projectId: string): Promise<number> {
    const { data, error } = await this.supabase.client
      .from('knots')
      .select('sequence_order')
      .eq('project_id', projectId)
      .order('sequence_order', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) return 1;
    return data.sequence_order + 1;
  }
}
