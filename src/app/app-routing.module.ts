import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { InsertdataComponent } from './insertdata/insertdata.component';
import { ProjectsComponent } from './projects/projects.component';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';


// const routes: Routes = [{ path: 'insertdata', loadChildren: () => import('./insertdata/insertdata.module').then(m => m.InsertdataModule) }, { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) }, { path: 'loading', loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule) }];
const routes: Routes = [ { path: 'Insertdata', component: InsertdataComponent },{ path: 'projects', component: ProjectsComponent }, { path: 'loading', component: LoadingComponent }, { path: '', component: HomeComponent},  {
  path: 'loading',loadChildren: () => import('./loading/loading.module').then((m) => m.LoadingModule ),
}];
@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes), RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
