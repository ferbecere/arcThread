import { Injectable } from "@angular/core"
import { Faction, FactionBase, FactionSnapshot, CreateFactionDto } from "../models/faction.model";
import {supabase} from "../app/supabaseClient";
import { SupabaseService } from './supabase.service';
import { Position } from '../models/canvas-entity.model';

@Injectable({
  providedIn: 'root'
})
export class FactionsService {
  constructor(private supabase: SupabaseService) {}

  async getFactionsInKnot(knotId: string): Promise<Faction[]> {
    const { data, error } = await this.supabase.client
      .from('faction_snapshots')
      .select(`
        *,
        factions:faction_id (
          id,
          project_id,
          name,
          symbol_url,
          parent_id,
          created_at
        )
      `)
      .eq('knot_id', knotId)
      .eq('is_visible', true);
    
    if (error) throw error;

    return data.map((snapshot: any) => ({
      type: 'faction' as const,
      id: snapshot.factions.id,
      project_id: snapshot.factions.project_id,
      name: snapshot.factions.name,
      symbol_url: snapshot.factions.symbol_url,
      parent_id: snapshot.factions.parent_id,
      created_at: snapshot.factions.created_at,
      snapshot_id: snapshot.id,
      alt_names: snapshot.alt_names,
      description_culture: snapshot.description_culture,
      description_territory: snapshot.description_territory,
      description_technology: snapshot.description_technology,
      motivation: snapshot.motivation,
      is_visible: snapshot.is_visible,
      position: snapshot.position_x !== null && snapshot.position_y !== null
        ? { x: snapshot.position_x, y: snapshot.position_y }
        : undefined,
      updated_at: snapshot.updated_at
    })) as Faction[];
  }

  async createFaction(dto: CreateFactionDto): Promise<Faction> {
    // 1. Crear facción base
    const { data: factionBase, error: factionError } = await this.supabase.client
      .from('factions')
      .insert({
        project_id: dto.project_id,
        name: dto.name,
        symbol_url: dto.symbol_url,
        parent_id: dto.parent_id
      })
      .select()
      .single();
    
    if (factionError) throw factionError;

    // 2. Crear primer snapshot
    const { data: snapshot, error: snapError } = await this.supabase.client
      .from('faction_snapshots')
      .insert({
        knot_id: dto.knot_id,
        faction_id: factionBase.id,
        alt_names: dto.alt_names,
        description_culture: dto.description_culture,
        description_territory: dto.description_territory,
        description_technology: dto.description_technology,
        motivation: dto.motivation,
        position_x: dto.position?.x,
        position_y: dto.position?.y,
        is_visible: true
      })
      .select()
      .single();
    
    if (snapError) throw snapError;

    return {
      type: 'faction',
      ...factionBase,
      snapshot_id: snapshot.id,
      ...snapshot,
      position: dto.position
    } as Faction;
  }

  async updateFactionSnapshot(
    snapshotId: string,
    updates: Partial<FactionSnapshot>
  ): Promise<void> {
    const updateData: any = { ...updates };
    
    if (updates.position) {
      updateData.position_x = updates.position.x;
      updateData.position_y = updates.position.y;
      delete updateData.position;
    }

    const { error } = await this.supabase.client
      .from('faction_snapshots')
      .update(updateData)
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  async updateFactionPosition(snapshotId: string, position: Position): Promise<void> {
    const { error } = await this.supabase.client
      .from('faction_snapshots')
      .update({
        position_x: position.x,
        position_y: position.y
      })
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  async hideFaction(snapshotId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('faction_snapshots')
      .update({ is_visible: false })
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  async deleteFaction(factionId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('factions')
      .delete()
      .eq('id', factionId);
    
    if (error) throw error;
  }

  async copySnapshotToNewKnot(
    factionId: string,
    sourceKnotId: string,
    targetKnotId: string
  ): Promise<FactionSnapshot> {
    const { data: sourceSnapshot, error: fetchError } = await this.supabase.client
      .from('faction_snapshots')
      .select('*')
      .eq('knot_id', sourceKnotId)
      .eq('faction_id', factionId)
      .single();
    
    if (fetchError) throw fetchError;

    const { data: newSnapshot, error: createError } = await this.supabase.client
      .from('faction_snapshots')
      .insert({
        knot_id: targetKnotId,
        faction_id: factionId,
        alt_names: sourceSnapshot.alt_names,
        description_culture: sourceSnapshot.description_culture,
        description_territory: sourceSnapshot.description_territory,
        description_technology: sourceSnapshot.description_technology,
        motivation: sourceSnapshot.motivation,
        position_x: sourceSnapshot.position_x,
        position_y: sourceSnapshot.position_y,
        is_visible: sourceSnapshot.is_visible
      })
      .select()
      .single();
    
    if (createError) throw createError;
    return newSnapshot as FactionSnapshot;
  }

  // Obtener todas las facciones base del proyecto (sin filtrar por knot)
  async getAllFactions(projectId: string): Promise<FactionBase[]> {
    const { data, error } = await this.supabase.client
      .from('factions')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    return data as FactionBase[];
  }
}