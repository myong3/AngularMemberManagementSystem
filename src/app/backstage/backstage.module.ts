import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackstageRoutingModule } from './backstage-routing.module';
import { BackstageComponent } from './backstage.component';


@NgModule({
  declarations: [BackstageComponent],
  imports: [
    CommonModule,
    BackstageRoutingModule
  ]
})
export class BackstageModule { }
