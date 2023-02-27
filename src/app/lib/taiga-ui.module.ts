import { NgModule } from '@angular/core';
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiFormatNumberPipeModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiRootModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { TuiInputCardGroupedModule } from '@taiga-ui/addon-commerce';
import { TuiCheckboxLabeledModule, TuiInputModule, TuiInputNumberModule } from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';

const TAIGA_UI_MODULES = [
  TuiRootModule,
  TuiDialogModule,
  TuiButtonModule,
  TuiLoaderModule,
  TuiLinkModule,
  TuiAutoFocusModule,

  TuiInputModule,
  TuiInputNumberModule,
  TuiInputCardGroupedModule,
  TuiTextfieldControllerModule,
  TuiCheckboxLabeledModule,

  TuiFormatNumberPipeModule
];

@NgModule({
  imports: TAIGA_UI_MODULES,
  exports: TAIGA_UI_MODULES
})
export class TaigaUIModule {}
