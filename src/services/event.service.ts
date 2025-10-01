import { Injectable } from "@angular/core";
import { Event, CreateEventDto } from "../models/event.model";
import { Position } from "../models/canvas-entity.model";
import { SupabaseService } from "./supabase.service";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private supabase: SupabaseService) {}

  async getEventsInKnot(knotId: string): Promise<Event[]> {
    const { data, error } = await this.supabase.client
      .from('events')
      .select('*')
      .eq('knot_id', knotId);
    
    if (error) throw error;

    return data.map((event: any) => ({
      type: 'event' as const,
      id: event.id,
      knot_id: event.knot_id,
      title: event.title,
      description: event.description,
      key_event: event.key_event,
      is_persistent: event.is_persistent,
      position: event.position_x !== null && event.position_y !== null
        ? { x: event.position_x, y: event.position_y }
        : undefined,
      created_at: event.created_at,
      updated_at: event.updated_at
    })) as Event[];
  }

  async createEvent(dto: CreateEventDto): Promise<Event> {
    const { data, error } = await this.supabase.client
      .from('events')
      .insert({
        knot_id: dto.knot_id,
        title: dto.title,
        description: dto.description,
        key_event: dto.key_event ?? false,
        is_persistent: dto.is_persistent ?? false,
        position_x: dto.position?.x,
        position_y: dto.position?.y
      })
      .select()
      .single();
    
    if (error) throw error;

    return {
      type: 'event',
      ...data,
      position: dto.position
    } as Event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const updateData: any = { ...updates };
    
    if (updates.position) {
      updateData.position_x = updates.position.x;
      updateData.position_y = updates.position.y;
      delete updateData.position;
    }

    const { data, error } = await this.supabase.client
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Event;
  }

  async updateEventPosition(id: string, position: Position): Promise<void> {
    const { error } = await this.supabase.client
      .from('events')
      .update({
        position_x: position.x,
        position_y: position.y
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Copiar eventos persistentes al nuevo knot
  async copyPersistentEventsToNewKnot(sourceKnotId: string, targetKnotId: string): Promise<Event[]> {
    // Obtener eventos persistentes del knot origen
    const { data: persistentEvents, error: fetchError } = await this.supabase.client
      .from('events')
      .select('*')
      .eq('knot_id', sourceKnotId)
      .eq('is_persistent', true);
    
    if (fetchError) throw fetchError;
    if (!persistentEvents || persistentEvents.length === 0) return [];

    // Copiar al nuevo knot
    const eventsToInsert = persistentEvents.map(event => ({
      knot_id: targetKnotId,
      title: event.title,
      description: event.description,
      key_event: event.key_event,
      is_persistent: event.is_persistent,
      position_x: event.position_x,
      position_y: event.position_y
    }));

    const { data: newEvents, error: insertError } = await this.supabase.client
      .from('events')
      .insert(eventsToInsert)
      .select();
    
    if (insertError) throw insertError;

    return newEvents.map(event => ({
      type: 'event' as const,
      ...event,
      position: event.position_x !== null && event.position_y !== null
        ? { x: event.position_x, y: event.position_y }
        : undefined
    })) as Event[];
  }
}