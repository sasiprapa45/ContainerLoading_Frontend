import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { InsertdataComponent } from '../insertdata/insertdata.component';
import { ProjectsComponent } from '../projects/projects.component';

const routes: Routes = [{ path: '', component: HomeComponent },{ path: 'Insertdata', component: InsertdataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
