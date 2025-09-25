import { Injectable } from "@angular/core"
import { Faction } from "../models/faction.model";
import {supabase} from "../app/supabaseClient";

@Injectable({
    providedIn: 'root',

})

export class FactionsService{

    async getFactions(): Promise<Faction[]>{
        const {data, error} = await supabase
        .from('factions')
        .select('*');

        if(error) throw error;
        return data as Faction[];
    }

    async getFactionById(id:string): Promise<Faction|null>{
        const {data, error} = await supabase
        .from('factions')
        .select('*')
        .eq('id',id)
        .single();

        if (error) throw error;
        return data as Faction|null;
    }

    async createFaction(faction: Partial<Faction>): Promise<Faction>{
        const {data, error} = await supabase
        .from('factions')
        .insert(faction)
        .select()
        .single();

        if(error)throw error;
        return data as Faction;
    }

    async updateFaction(id:string, faction:Partial<Faction>): Promise<Faction>{
        const {data,error} = await supabase
        .from('factions')
        .update(faction)
        .eq('id',id)
        .select()
        .single();

        if(error) throw error;
        return data as Faction;
    }

    async deleteFaction(id:string): Promise<void>{
        const {error} = await supabase
        .from('factions')
        .delete()
        .eq('id',id);

        if(error)throw error;
    }

}

