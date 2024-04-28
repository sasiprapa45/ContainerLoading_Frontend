import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { InsertdataComponent } from '../insertdata/insertdata.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { InsertdataModule } from '../insertdata/insertdata.module';
import { AppModule } from '../app.module';


@NgModule({
  declarations: [
    HomeComponent,
    InsertdataComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzFormModule,
    AppModule,
  ]
})
export class HomeModule { }
