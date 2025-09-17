import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactionsService } from '../../../../services/factions.service';
import { FactionCardComponent } from '../faction-card/faction-card.component';



@Component({
  selector: 'app-faction-list',
  standalone:true,
  imports: [CommonModule, FactionCardComponent],
  templateUrl: './faction-list.component.html',
  styleUrl: './faction-list.component.css'
})
export class FactionListComponent implements OnInit {
  factions: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private factionsService: FactionsService){}

  ngOnInit(): void {
      this.loadFactions();
  }

  async loadFactions(){
    this.loading = true;
    this.error = null;
    try{
      this.factions = await this.factionsService.getFactions();
    } catch (err: any){
      console.error("Error loading factions",err);
      this.error = err.message || 'Error loading factions';
    }finally{
      this.loading = false;
    }
  }

  async deleteFaction(factionId:string){
    if(!confirm("Are your sure you want to delete this faction?"))return;
    try{
      await this.factionsService.deleteFaction(factionId);
      this.factions = this.factions.filter(f=> f.id !== factionId);
    } catch(err:any){
      console.error("Error deleting faciton", err);
      alert("I was not possible to delete this faction");
    }
  }
  // faltan las demas accioens del CRUD, de mometno es para probar poma 
}
