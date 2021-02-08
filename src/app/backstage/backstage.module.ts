import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BackstageRoutingModule } from './backstage-routing.module';
import {
  BackstageComponent,
  NgbdModalConfirm,
  NgbdModalConfirmAutofocus,
} from './backstage.component';
@NgModule({
  declarations: [BackstageComponent, NgbdModalConfirm, NgbdModalConfirmAutofocus],
  imports: [
    CommonModule,
    BackstageRoutingModule,
    ReactiveFormsModule
  ],
  entryComponents: [NgbdModalConfirm, NgbdModalConfirmAutofocus],
})
export class BackstageModule {}
