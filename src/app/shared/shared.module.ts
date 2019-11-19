import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { InputComponent } from './components/input/input-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SpinnerComponent,
    InputComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    SpinnerComponent,
    InputComponent,
  ]
})
export class SharedModule {}
