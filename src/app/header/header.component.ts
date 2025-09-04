import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  email:string = '';
  password: string = '';
  currentUser: string | null = null;

  constructor(
    private supabase: SupabaseService, 
    private router:Router){
      this.checkAuthState();
    }

  ngOnInit():void{
    this.checkAuthState();
    this.getInitialSession();
  }

  async getInitialSession(){
    const session = await this.supabase.getSession();
    this.currentUser = session?.user?.email ?? null;
  }

  async onSignIn(){
    try{
      const user = await this.supabase.signIn(this.email,this.password);
      alert("User loged");
      this.router.navigate(['home']);
    }catch (error:any){
      console.error(error.message);
      alert(error.message);
    }
  }

  async logOut(){
    try{
      await this.supabase.signOut();
      this.currentUser = null;
      this.email = '';
      this.password = '',
      this.router.navigate(['']);
    }catch(error:any){
      console.error(error.message);
      alert(error.message);
    }
  }

  checkAuthState(){
    this.supabase.onAuthStateChange((event,session)=>{
      
        this.currentUser = session?.user?.email ?? null;
    });
  }

  openRegisterModal(){
    // poma 
    alert ("Abrir modal de registro!! pendeinte de implementar!!");
  }

}
