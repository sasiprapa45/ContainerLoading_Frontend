import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsertdataComponent } from './insertdata.component';

const routes: Routes = [{ path: '', component: InsertdataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsertdataRoutingModule { }
