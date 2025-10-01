import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MainBoardComponent } from '../components/main-board/main-board.component';
import { TimeThreadComponent } from '../components/time-thread/time-thread.component';
import { LeftSidebarComponent } from '../components/sidebars/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../components/sidebars/right-sidebar/right-sidebar.component';

import { ProjectService } from '../../services/project.service';
import { KnotService } from '../../services/knot.service';
import { WorkspaceStateService } from '../../services/workspace-state.service';
import { Project } from '../../models/project.model';
import { Knot } from '../../models/knot.model';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    MainBoardComponent,
    TimeThreadComponent,
    LeftSidebarComponent,
    RightSidebarComponent
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css'
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  projectId: string = '';
  project: Project | null = null;
  knots: Knot[] = [];
  currentKnot: Knot | null = null;
  
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private knotService: KnotService,
    private workspaceState: WorkspaceStateService
  ) {}

  async ngOnInit() {
    // Obtener projectId de la ruta
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.projectId = params['projectId'];
        if (this.projectId) {
          this.loadWorkspace();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.workspaceState.clear();
  }

  private async loadWorkspace(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      // 1. Cargar proyecto
      this.project = await this.projectService.getProjectById(this.projectId);
      
      if (!this.project) {
        this.error = 'Project not found';
        this.router.navigate(['/projects']);
        return;
      }

      // 2. Actualizar estado global
      this.workspaceState.setCurrentProject(this.project);

      // 3. Cargar knots del proyecto
      this.knots = await this.knotService.getKnots(this.projectId);

      // 4. Si no hay knots, crear el primero
      if (this.knots.length === 0) {
        await this.createFirstKnot();
      } else {
        // Seleccionar el primer knot como activo
        this.selectKnot(this.knots[0]);
      }

    } catch (err: any) {
      console.error('Error loading workspace:', err);
      this.error = err.message || 'Failed to load workspace';
    } finally {
      this.loading = false;
    }
  }

  private async createFirstKnot(): Promise<void> {
    try {
      const firstKnot = await this.knotService.createKnot({
        project_id: this.projectId,
        title: 'Beginning',
        date: new Date().toISOString().split('T')[0], // Fecha actual
        sequence_order: 1,
        chapter: 'Chapter 1'
      });

      this.knots = [firstKnot];
      this.selectKnot(firstKnot);
    } catch (err: any) {
      console.error('Error creating first knot:', err);
      throw err;
    }
  }

  selectKnot(knot: Knot): void {
    this.currentKnot = knot;
    this.workspaceState.setCurrentKnot(knot);
  }

  async handleKnotCreated(knot: Knot): Promise<void> {
    this.knots = [...this.knots, knot];
    this.selectKnot(knot);
  }

  async handleKnotDeleted(knotId: string): Promise<void> {
    this.knots = this.knots.filter(k => k.id !== knotId);
    
    // Si se eliminó el knot activo, seleccionar otro
    if (this.currentKnot?.id === knotId) {
      if (this.knots.length > 0) {
        this.selectKnot(this.knots[0]);
      } else {
        this.currentKnot = null;
        this.workspaceState.setCurrentKnot(null);
      }
    }
  }

  goBackToProjects(): void {
    this.router.navigate(['/projects']);
  }
}
