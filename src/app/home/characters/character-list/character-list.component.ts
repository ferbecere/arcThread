import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../../../services/characters.service';
import { CharacterCardComponent } from '../character-card/character-card.component';

@Component({
  selector: 'app-character-list',
  standalone:true,
  imports: [CommonModule,CharacterCardComponent],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit{
  characters: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private characterService: CharacterService){}

  async ngOnInit(){
      
    try{
      this.characters = await this.characterService.getCharacters();
    
    } catch(err:any){
      this.error = err.message ?? 'Loading Characters error';
    
    } finally {
      this.loading = false;
    }
  }

}
