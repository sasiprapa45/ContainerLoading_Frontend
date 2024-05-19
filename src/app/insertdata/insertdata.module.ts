import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InsertdataRoutingModule } from './insertdata-routing.module';
import { InsertdataComponent} from './insertdata.component';

import { HomeModule } from '../home/home.module';
// import { AppModule } from '../app.module';
import { FormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [
  ],
  imports: [
    InsertdataRoutingModule,
    CommonModule,
    NzGridModule,
    NzTableModule,
    NzDividerModule,
    // AppModule,
  ]
})
export class InsertdataModule { }
