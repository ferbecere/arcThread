import { Injectable } from "@angular/core"
import { SupabaseService } from "./supabase.service";

export interface Faction {
    id?: string;
    name: string;
    description?: string;
    type?: string;
    emplemUrl?:string;
    leaders?: string[];
    associatedCharacters?: string[];
    created_at?:string;

}

@Injectable({
    providedIn: 'root',

})

export class FactionsService{
    constructor(private supabase: SupabaseService){}

    async getFactions(): Promise<Faction[]>{
        const {data, error} = await this.supabase.client
        .from('factions')
        .select('*');

        if(error) throw error;
        return data as Faction[];
    }

    async getFactionById(id:string): Promise<Faction|null>{
    const {data, error} = await this.supabase.client
    .from('factions')
    .select('*')
    .eq('id',id)
    .single();
    if (error) throw error;
    return data as Faction|null;
    }

    async createFaction(faction: Partial<Faction>): Promise<Faction>{
        const {data, error} = await this.supabase.client
        .from('factions')
        .insert(faction)
        .select()
        .single();
    if(error)throw error;
    return data as Faction;
    }

    async updateFaction(id:string, faction:Partial<Faction>): Promise<Faction>{
        const {data,error} = await this.supabase.client
        .from('factions')
        .update(faction)
        .eq('id',id)
        .select()
        .single();

        if(error) throw error;
        return data as Faction;
    }



    async deleteFaction(id:string): Promise<void>{
        const {error} = await this.supabase.client
        .from('factions')
        .delete()
        .eq('id',id);

        if(error)throw error;
    }

}

