import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ProjectsComponent } from './projects/projects.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'', component:LandingComponent},
    {
    path: 'projects',
    component: ProjectsComponent
    // TODO: Añadir guard de autenticación cuando esté listo
    // canActivate: [AuthGuard]
  },
  {
    path: 'workspace/:projectId',
    component: WorkspaceComponent
    // TODO: Añadir guard de autenticación cuando esté listo
    // canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }

];
