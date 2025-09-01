import {Injectable} from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

import {environment} from '../environments/environment';


@Injectable({
    providedIn: 'root',
})

export class SupabaseService{
    private supabase:SupabaseClient;
    private currentSession: Session |null = null;

    constructor(){
        this.supabase = createClient(environment.supabaseUrl,environment.supabaseAnonKey);

        //session changes (login/logout/refresh)
        this.supabase.auth.onAuthStateChange((_event,session)=>{
            this.currentSession = session;
        });
    }

    async getSession(): Promise<Session |null>{
        const{data, error} = await this.supabase.auth.getSession();
        if(error) throw error;
        this.currentSession = data.session;
        return data.session ?? null;
    }


    async signUp(email:string, password:string): Promise<User | null>{
        const {data,error} = await this.supabase.auth.signUp({email,password});
        if (error) throw error;
        return data.user ?? null;
    }

    async signIn(email:string, password:string):Promise<User | null>{
        const {data,error} = await this.supabase.auth.signInWithPassword({email,password});
        if (error) throw error;
        return data.user ?? null;
    }

    async signOut():Promise<void>{
        const {error} = await this.supabase.auth.signOut();
        if(error) throw error;
    }

    async getUser(): Promise<User | null>{
        const {data,error} = await this.supabase.auth.getUser();
        if(error) throw error;
        return data.user ?? null;
    }

    onAuthStateChange(callback:(event:string, session: Session |null)=> void){
        this.supabase.auth.onAuthStateChange((event:string,session: Session | null)=>{
            callback(event,session);
        })
    }


}

