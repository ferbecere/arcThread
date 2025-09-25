export interface Character {
    type:'character';

    id?:string;
    name: string;
    alias?:string;
    avatar_url?: string;
    birthdate?: string; 
    role?: string;
    personality_motivation?: string;
    biography_development?: string;
    appearance?: string;
    created_at?: string;

    position?: {x:number; y: number}; //integrar con supabase!
    colliding?: boolean;
}