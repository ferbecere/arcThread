import { Injectable } from "@angular/core";
import { Event as EventModel } from "../models/event.model";
import { supabase} from "../app/supabaseClient"

@Injectable({
    providedIn:'root'
})

export class EventService{

    async getEvents(): Promise<EventModel[]>{
        const {data, error} = await supabase
        .from('events')
        .select('*');

        if(error) throw error;
        return data as EventModel[];
    }

    async getEventById(id:string): Promise<EventModel | null>{
        const {data,error}=await supabase
        .from('events')
        .select('*')
        .eq('id',id)
        .single();

        if(error) throw error;
        return data as EventModel | null;

    }

    async addEvent(event: Partial<EventModel>): Promise<EventModel>{
        const {data,error} = await supabase
        .from('events')
        .insert( [event])
        .select()
        .single();

        if(error) throw error;
        return data as EventModel;

    }

    async updateEvent(id:string, updates:Partial<EventModel>): Promise<EventModel>{
        const {data,error} = await supabase
        .from('events')
        .update(updates)
        .eq('id',id)
        .select()
        .single();

        if(error) throw error;
        return data as EventModel;

    }

    async deleteEvent(id:string): Promise<void>{
        const {error} = await supabase
        .from('events')
        .delete()
        .eq('id',id)

        if(error) throw error;

    }




}