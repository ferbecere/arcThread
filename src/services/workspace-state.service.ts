import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { Knot } from '../models/knot.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService { 
  private currentProjectSubject = new BehaviorSubject<Project | null>(null);
  private currentKnotSubject = new BehaviorSubject<Knot | null>(null);

  currentProject$: Observable<Project | null> = this.currentProjectSubject.asObservable();
  currentKnot$: Observable<Knot | null> = this.currentKnotSubject.asObservable();

  get currentProject(): Project | null {
    return this.currentProjectSubject.value;
  }

  get currentKnot(): Knot | null {
    return this.currentKnotSubject.value;
  }

  setCurrentProject(project: Project | null): void {
    this.currentProjectSubject.next(project);
  }

  setCurrentKnot(knot: Knot | null): void {
    this.currentKnotSubject.next(knot);
  }

  clear(): void {
    this.currentProjectSubject.next(null);
    this.currentKnotSubject.next(null);
  }
}