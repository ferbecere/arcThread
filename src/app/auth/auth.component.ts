import { Component, OnInit } from '@angular/core';
import { FormsModule} from '@angular/forms';
import {SupabaseService} from '../../services/supabase.service';
import {User} from '@supabase/supabase-js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent implements OnInit{
  email: string ='';
  password: string = '';
  user:User | null = null;

  constructor(private supabase:SupabaseService, private router: Router){}

  async ngOnInit() {
      try{
        const session = await this.supabase.getSession();
        console.log("Session recovered:", this.user);
      } catch(error:any){
        console.error("Error recovering session:", error.message);
      }
  }

  async onSignUp(){
    try{
      const user = await this.supabase.signUp(this.email,this.password);
      console.log("User registered:", user);
      if(user){
        alert("User correctly registered!");
        this.router.navigate(['home']);
      }

    } catch(error:any){
      console.error(error.message);
      alert(error.message);
    }
  }

  async onSignIn(){
    try{
      const user = await this.supabase.signIn(this.email, this.password);
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
