import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayComponent } from '../components';

const routes: Routes = [
  {
    path: '',
    component: PayComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
