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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzUploadModule,
    NzLayoutModule,
    NzGridModule,
    NzRadioModule,
    NzBreadCrumbModule,
    NzTreeViewModule,
    NzMenuModule ,
    NzIconModule,
  ]
})
export class HomeModule { }
