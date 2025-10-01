import { Injectable } from "@angular/core";
import { Character, CharacterBase, CharacterSnapshot, CreateCharacterDto } from "../models/character.model";
import { Position } from '../models/canvas-entity.model';
import { SupabaseService } from "./supabase.service";

@Injectable({
    providedIn: 'root'
})

export class CharactersService{
    constructor(private supabase: SupabaseService) {}

    // Obtener personajes de un knot específico (con snapshots)
  async getCharactersInKnot(knotId: string): Promise<Character[]> {
    const { data, error } = await this.supabase.client
      .from('character_snapshots')
      .select(`
        *,
        characters:character_id (
          id,
          project_id,
          name,
          birthdate,
          created_at
        )
      `)
      .eq('knot_id', knotId)
      .eq('is_visible', true);
    
    if (error) throw error;

    return data.map((snapshot: any) => ({
      type: 'character' as const,
      // Base data
      id: snapshot.characters.id,
      project_id: snapshot.characters.project_id,
      name: snapshot.characters.name,
      birthdate: snapshot.characters.birthdate,
      created_at: snapshot.characters.created_at,
      // Snapshot data
      snapshot_id: snapshot.id,
      alias: snapshot.alias,
      avatar_url: snapshot.avatar_url,
      role: snapshot.role,
      personality_motivation: snapshot.personality_motivation,
      biography_development: snapshot.biography_development,
      appearance: snapshot.appearance,
      is_visible: snapshot.is_visible,
      position: snapshot.position_x !== null && snapshot.position_y !== null 
        ? { x: snapshot.position_x, y: snapshot.position_y }
        : undefined,
      updated_at: snapshot.updated_at
    })) as Character[];
  }

  // Crear personaje base + primer snapshot
  async createCharacter(dto: CreateCharacterDto): Promise<Character> {
    // 1. Crear personaje base
    const { data: characterBase, error: charError } = await this.supabase.client
      .from('characters')
      .insert({
        project_id: dto.project_id,
        name: dto.name,
        birthdate: dto.birthdate
      })
      .select()
      .single();
    
    if (charError) throw charError;

    // 2. Crear primer snapshot
    const { data: snapshot, error: snapError } = await this.supabase.client
      .from('character_snapshots')
      .insert({
        knot_id: dto.knot_id,
        character_id: characterBase.id,
        alias: dto.alias,
        avatar_url: dto.avatar_url,
        role: dto.role,
        personality_motivation: dto.personality_motivation,
        biography_development: dto.biography_development,
        appearance: dto.appearance,
        position_x: dto.position?.x,
        position_y: dto.position?.y,
        is_visible: true
      })
      .select()
      .single();
    
    if (snapError) throw snapError;

    return {
      type: 'character',
      ...characterBase,
      snapshot_id: snapshot.id,
      ...snapshot,
      position: dto.position
    } as Character;
  }

  // Actualizar snapshot de personaje en knot actual
  async updateCharacterSnapshot(
    snapshotId: string, 
    updates: Partial<CharacterSnapshot>
  ): Promise<void> {
    const updateData: any = { ...updates };
    
    // Convertir position a position_x, position_y
    if (updates.position) {
      updateData.position_x = updates.position.x;
      updateData.position_y = updates.position.y;
      delete updateData.position;
    }

    const { error } = await this.supabase.client
      .from('character_snapshots')
      .update(updateData)
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  // Actualizar solo la posición (para drag & drop)
  async updateCharacterPosition(snapshotId: string, position: Position): Promise<void> {
    const { error } = await this.supabase.client
      .from('character_snapshots')
      .update({
        position_x: position.x,
        position_y: position.y
      })
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  // Ocultar personaje (soft delete del snapshot)
  async hideCharacter(snapshotId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('character_snapshots')
      .update({ is_visible: false })
      .eq('id', snapshotId);
    
    if (error) throw error;
  }

  // Eliminar personaje completamente (base + todos sus snapshots)
  async deleteCharacter(characterId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('characters')
      .delete()
      .eq('id', characterId);
    
    if (error) throw error;
  }

  // Copiar snapshot del knot anterior al nuevo knot
  async copySnapshotToNewKnot(
    characterId: string,
    sourceKnotId: string,
    targetKnotId: string
  ): Promise<CharacterSnapshot> {
    // Obtener snapshot origen
    const { data: sourceSnapshot, error: fetchError } = await this.supabase.client
      .from('character_snapshots')
      .select('*')
      .eq('knot_id', sourceKnotId)
      .eq('character_id', characterId)
      .single();
    
    if (fetchError) throw fetchError;

    // Crear copia en nuevo knot
    const { data: newSnapshot, error: createError } = await this.supabase.client
      .from('character_snapshots')
      .insert({
        knot_id: targetKnotId,
        character_id: characterId,
        alias: sourceSnapshot.alias,
        avatar_url: sourceSnapshot.avatar_url,
        role: sourceSnapshot.role,
        personality_motivation: sourceSnapshot.personality_motivation,
        biography_development: sourceSnapshot.biography_development,
        appearance: sourceSnapshot.appearance,
        position_x: sourceSnapshot.position_x,
        position_y: sourceSnapshot.position_y,
        is_visible: sourceSnapshot.is_visible
      })
      .select()
      .single();
    
    if (createError) throw createError;
    return newSnapshot as CharacterSnapshot;
  }
}
