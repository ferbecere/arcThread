import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";
import { Event } from "../models/event.model";

@Injectable({
    providedIn:'root'
})

export class EventService{
    constructor(private supabaseService : SupabaseService){}

    async getEvents(): Promise<Event[]>{
        const {data, error} = await this.supabaseService.client
        .from('events')
        .select('*');

        if(error) throw error;
        return data as Event[];
    }

    async getEventById(id:string): Promise<Event | null>{
        const {data,error}=await this.supabaseService.client
        .from('events')
        .select('*')
        .eq('id',id)
        .single();

        if(error) throw error;
        return data as Event | null;

    }

    async addEvent(event: Partial<Event>): Promise<Event>{
        const {data,error} = await this.supabaseService.client
        .from('events')
        .insert( [event])
        .select()
        .single();

        if(error) throw error;
        return data as Event;

    }

    async updateEvent(id:string, updates:Partial<Event>): Promise<Event>{
        const {data,error} = await this.supabaseService.client
        .from('events')
        .update(updates)
        .eq('id',id)
        .select()
        .single();

        if(error) throw error;
        return data as Event;

    }

    async deleteEvent(id:string): Promise<void>{
        const {error} = await this.supabaseService.client
        .from('events')
        .delete()
        .eq('id',id)

        if(error) throw error;

    }




}