import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";

@Injectable({
    providedIn:'root'
})

export class EventService{
    constructor(private supabaseService : SupabaseService){}

    async getEvents(){
        const {data, error} = await this.supabaseService.client
        .from('events')
        .select('*');

        if(error) throw error;
        return data;
    }

    async addEvent(event:any){
        const {data,error} = await this.supabaseService.client
        .from('events')
        .insert( [event])
        .select();

        if(error) throw error;
        return data;

    }

    async updateEvent(id:string, updates:any){
        const {data,error} = await this.supabaseService.client
        .from('events')
        .update(updates)
        .eq('id',id)
        .select();

        if(error) throw error;
        return data;

    }

    async deleteEvent(id:string){
        const {data,error} = await this.supabaseService.client
        .from('events')
        .delete()
        .eq('id',id)
        .select();

        if(error) throw error;
        return data;

    }




}