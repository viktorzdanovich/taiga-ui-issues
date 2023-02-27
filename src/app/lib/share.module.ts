import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

const SHARED_MODULES = [
  CommonModule,
  ReactiveFormsModule
];

@NgModule({
  declarations: [],
  imports: SHARED_MODULES,
  exports: SHARED_MODULES
})
export class ShareModule {
}
