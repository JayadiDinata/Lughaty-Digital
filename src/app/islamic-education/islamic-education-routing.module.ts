import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IslamicEducationPage } from './islamic-education.page';

const routes: Routes = [
  {
    path: '',
    component: IslamicEducationPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IslamicEducationPageRoutingModule {}
