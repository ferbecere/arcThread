import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal para crear proyecto
  showCreateModal = false;
  newProjectTitle = '';
  newProjectDescription = '';

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    try {
      this.projects = await this.projectService.getProjects();
    } catch (err: any) {
      console.error('Error loading projects:', err);
      this.error = err.message || 'Failed to load projects';
    } finally {
      this.loading = false;
    }
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newProjectTitle = '';
    this.newProjectDescription = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  async createProject(): Promise<void> {
    if (!this.newProjectTitle.trim()) {
      alert('Project title is required');
      return;
    }

    this.loading = true;
    try {
      const newProject = await this.projectService.createProject({
        title: this.newProjectTitle.trim(),
        description: this.newProjectDescription.trim() || undefined
      });
      
      this.projects = [newProject, ...this.projects];
      this.closeCreateModal();
      
      // Navegar directamente al nuevo proyecto
      this.openProject(newProject.id);
    } catch (err: any) {
      console.error('Error creating project:', err);
      alert(err.message || 'Failed to create project');
    } finally {
      this.loading = false;
    }
  }

  openProject(projectId: string): void {
    this.router.navigate(['/workspace', projectId]);
  }

  async deleteProject(project: Project, event: Event): Promise<void> {
    event.stopPropagation(); // Evitar que se abra el proyecto al hacer click en delete
    
    if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      return;
    }

    this.loading = true;
    try {
      await this.projectService.deleteProject(project.id);
      this.projects = this.projects.filter(p => p.id !== project.id);
    } catch (err: any) {
      console.error('Error deleting project:', err);
      alert(err.message || 'Failed to delete project');
    } finally {
      this.loading = false;
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
