import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackstageRoutingModule } from './backstage-routing.module';
import {
  BackstageComponent,
  comfirmModal,
  editModal
} from './backstage.component';
import { FocusInvalidInputDirective } from './focusInvalidInput.directive';
@NgModule({
  declarations: [BackstageComponent, editModal, comfirmModal, FocusInvalidInputDirective],
  imports: [
    CommonModule,
    BackstageRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents: [editModal, comfirmModal],
})
export class BackstageModule {}
