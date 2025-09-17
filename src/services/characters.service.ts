import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";
import { Character } from "../models/character.model";


@Injectable({
    providedIn: 'root'
})

export class CharactersService{
    constructor(private supabaseService: SupabaseService){}
    
    async getCharacters():Promise<Character[]>{
        const {data, error} = await this.supabaseService.client
        .from('characters')
        .select('*');

        if(error) throw error;
        return data as Character[];
    }

    async getCharacterById(id: string): Promise<Character | null> {
        const { data, error } = await this.supabaseService.client
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

        if (error) throw error;
        return data as Character | null;
    }


    async addCharacter(character:Partial<Character>):Promise<Character>{
        const{data, error}= await this.supabaseService.client
        .from('characters')
        .insert([character])
        .select()
        .single();

        if(error) throw error;
        return data as Character;
    }

    async updateCharacter(id:string, updates:Partial<Character>): Promise<Character>{
        const {data, error} = await this.supabaseService.client
        .from('characters')
        .update(updates)
        .eq('id',id)
        .select()
        .single();

        if(error) throw error;
        return data as Character;

    }

    async deleteCharacter(id:string): Promise<void>{
        const {error} = await this.supabaseService.client
        .from('characters')
        .delete()
        .eq('id',id);
        if(error) throw error;
    }
}

