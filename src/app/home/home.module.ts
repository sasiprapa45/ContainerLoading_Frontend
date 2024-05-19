import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { InsertdataComponent } from '../insertdata/insertdata.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { InsertdataModule } from '../insertdata/insertdata.module';
import { AppModule } from '../app.module';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
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
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzTabsModule,
  ]
})
export class HomeModule { }
