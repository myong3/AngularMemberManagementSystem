import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusInvalidInputDirective } from './focusInvalidInput.directive';

@NgModule({
  declarations: [SignupComponent, FocusInvalidInputDirective],
  imports: [CommonModule, SignupRoutingModule, ReactiveFormsModule],
})
export class SignupModule {}
