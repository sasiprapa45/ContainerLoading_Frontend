import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { InsertdataComponent } from './insertdata/insertdata.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ProjectshowComponent } from './projectshow/projectshow.component';
import { ProjectdataComponent } from './projectdata/projectdata.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AuthGuard } from './auth/auth.guard';


// const routes: Routes = [{ path: 'insertdata', loadChildren: () => import('./insertdata/insertdata.module').then(m => m.InsertdataModule) }, { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) }, { path: 'loading', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) }];
const routes: Routes = [
  {path: 'loading',loadChildren: () => import('./loading/loading.module').then((m) => m.LoadingModule ), canActivate: [AuthGuard]},
  { path: 'Insertdata',loadChildren: () => import('./insertdata/insertdata.module').then((m) => m.InsertdataModule )},
  { path: 'projects',loadChildren: () => import('./projects/projects.module').then((m) => m.ProjectsModule )},
  {path:'projectshow', component:ProjectshowComponent , canActivate: [AuthGuard],children: [
    {
      path:'projectdata', component: ProjectdataComponent, canActivate: [AuthGuard]
    },
    {
      path: 'loading', component: LoadingComponent, canActivate: [AuthGuard]
    }
  ]},
  {path:'home', component:HomeComponent ,children: [
    {
      path:'projects', component: ProjectsComponent, canActivate: [AuthGuard]
    },
    {
      path: 'Insertdata', component: InsertdataComponent, canActivate: [AuthGuard]
    },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes), RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
