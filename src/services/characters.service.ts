import { Injectable } from "@angular/core";
import { SupabaseService } from "./supabase.service";


@Injectable({
    providedIn: 'root'
})

export class CharacterService{
    constructor(private supabaseService: SupabaseService){}
    
    async getCharacters(){
        const {data, error} = await this.supabaseService.client
        .from('characters')
        .select('*');

        if(error){
            console.error('Error fetching characters:', error);
            throw error;
        }
        return data;
    }

    async addCharacter(character:any){
        const{data, error}= await this.supabaseService.client
        .from('characters')
        .insert(character)
        .select();
        if(error) throw error;
        return data;
    }
}

