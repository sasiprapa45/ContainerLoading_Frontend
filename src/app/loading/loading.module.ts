import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingRoutingModule } from './loading-routing.module';
import { LoadingComponent } from './loading.component';
import { LoadingComponent as LoadingComponent1} from './loading.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';


@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    LoadingRoutingModule,
    RouterModule,
    AppRoutingModule,
    NzDrawerModule,
    NzGridModule,
    NzSelectModule,
    NzInputModule,
    NzDescriptionsModule,
  ],
  exports: [
    LoadingComponent1,
  ],
})
export class LoadingModule { }
