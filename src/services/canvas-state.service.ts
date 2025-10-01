import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../models/character.model';
import { Faction } from '../models/faction.model';
import { Event } from '../models/event.model';
import { CanvasCard } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CanvasStateService {
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  private factionsSubject = new BehaviorSubject<Faction[]>([]);
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private selectedCardSubject = new BehaviorSubject<CanvasCard | null>(null);

  characters$ = this.charactersSubject.asObservable();
  factions$ = this.factionsSubject.asObservable();
  events$ = this.eventsSubject.asObservable();
  selectedCard$ = this.selectedCardSubject.asObservable();

  get characters(): Character[] {
    return this.charactersSubject.value;
  }

  get factions(): Faction[] {
    return this.factionsSubject.value;
  }

  get events(): Event[] {
    return this.eventsSubject.value;
  }

  get allCards(): CanvasCard[] {
    return [...this.characters, ...this.factions, ...this.events];
  }

  setCharacters(characters: Character[]): void {
    this.charactersSubject.next(characters);
  }

  setFactions(factions: Faction[]): void {
    this.factionsSubject.next(factions);
  }

  setEvents(events: Event[]): void {
    this.eventsSubject.next(events);
  }

  addCharacter(character: Character): void {
    this.charactersSubject.next([...this.characters, character]);
  }

  addFaction(faction: Faction): void {
    this.factionsSubject.next([...this.factions, faction]);
  }

  addEvent(event: Event): void {
    this.eventsSubject.next([...this.events, event]);
  }

  updateCharacter(id: string, updates: Partial<Character>): void {
    const updated = this.characters.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    this.charactersSubject.next(updated);
  }

  updateFaction(id: string, updates: Partial<Faction>): void {
    const updated = this.factions.map(f => 
      f.id === id ? { ...f, ...updates } : f
    );
    this.factionsSubject.next(updated);
  }

  updateEvent(id: string, updates: Partial<Event>): void {
    const updated = this.events.map(e => 
      e.id === id ? { ...e, ...updates } : e
    );
    this.eventsSubject.next(updated);
  }

  removeCharacter(id: string): void {
    this.charactersSubject.next(this.characters.filter(c => c.id !== id));
  }

  removeFaction(id: string): void {
    this.factionsSubject.next(this.factions.filter(f => f.id !== id));
  }

  removeEvent(id: string): void {
    this.eventsSubject.next(this.events.filter(e => e.id !== id));
  }

  selectCard(card: CanvasCard | null): void {
    this.selectedCardSubject.next(card);
  }

  clearAll(): void {
    this.charactersSubject.next([]);
    this.factionsSubject.next([]);
    this.eventsSubject.next([]);
    this.selectedCardSubject.next(null);
  }

  // Detección de colisiones
  checkCollisions(): void {
    const allCards = this.allCards;
    
    // Reset colliding flags
    allCards.forEach(card => {
      card.colliding = false;
    });

    // Check collisions
    for (let i = 0; i < allCards.length; i++) {
      for (let j = i + 1; j < allCards.length; j++) {
        if (this.isColliding(allCards[i], allCards[j])) {
          allCards[i].colliding = true;
          allCards[j].colliding = true;
        }
      }
    }

    // Update subjects
    this.charactersSubject.next(this.characters);
    this.factionsSubject.next(this.factions);
    this.eventsSubject.next(this.events);
  }

  private isColliding(a: CanvasCard, b: CanvasCard): boolean {
    if (!a.position || !b.position) return false;

    const widthA = a.width ?? 120;
    const heightA = a.height ?? 160;
    const widthB = b.width ?? 120;
    const heightB = b.height ?? 160;

    return !(
      a.position.x + widthA < b.position.x ||
      a.position.x > b.position.x + widthB ||
      a.position.y + heightA < b.position.y ||
      a.position.y > b.position.y + heightB
    );
  }
}