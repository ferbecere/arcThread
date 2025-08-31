import { Component } from '@angular/core';
import {SupabaseService} from '../../services/supabase.service';


@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent {
  email: string ='';
  password: string = '';

  constructor(private supabase:SupabaseService){}

  async onSignUp(){
    try{
      const {user} = await this.supabase.signUp(this.email,this.password);
      console.log("User registered:", user);
      alert("User correctly registered!");
    } catch(error:any){
      console.error(error.message);
      alert(error.message);
    }
  }

  async onSignIn(){
    try{
      const{user} = await this.supabase.signIn(this.email, this.password);
      console.log("user signed in:",user);
      alert("User Loged correctly!");
    }catch(error:any){
      console.error(error.message);
      alert(error.message);
    }
  }

  async onSignOut(){
    try{
      await this.supabase.signOut();
      alert("Session closed");
    }catch(error:any){
      console.error(error.message);
      alert(error.message);
    }
  }




}
