export interface Event {
    type:'event';

    id?: string;
    title: string;
    chapter?: string;
    year?: number;
    act?: string;
    key_event?: boolean;
    description?: string;
    created_at?: string;

    position?: {x:number; y: number}; //integarte in supabase
}