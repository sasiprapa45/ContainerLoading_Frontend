import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingRoutingModule } from './loading-routing.module';
import { LoadingComponent } from './loading.component';
import { LoadingComponent as LoadingComponent1} from './loading.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    LoadingRoutingModule,
    RouterModule,
    AppRoutingModule,

  ],
  exports: [
    LoadingComponent1,
  ],
})
export class LoadingModule { }
