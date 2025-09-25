export interface Faction {
    type:'faction';

    id?: string;
    name: string;
    alt_names?: string[];
    parent_id?: string;
    symbol_url?: string;
    description_culture?:string,
    description_territory?:string;
    description_technology?:string;
    motivation?:string;
    leaders?:string[];
    characters_associated?:string[];
    created_at?:string;

    position?: {x:number; y: number}; //to integrate in supabase
    colliding?: boolean;
}