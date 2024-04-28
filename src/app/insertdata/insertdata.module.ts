import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InsertdataRoutingModule } from './insertdata-routing.module';
import { InsertdataComponent } from './insertdata.component';

import { HomeModule } from '../home/home.module';
import { AppModule } from '../app.module';

@NgModule({
  declarations: [
  ],
  imports: [
    InsertdataRoutingModule,
    CommonModule,
    AppModule,
  ]
})
export class InsertdataModule { }
