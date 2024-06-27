import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertdataComponent } from './insertdata.component';
import { LoadingComponent } from '../loading/loading.component';

const routes: Routes = [{ path: 'loading', component: LoadingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsertdataRoutingModule { }
