import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SunnahHadithPage } from './sunnah-hadith.page';

const routes: Routes = [
  {
    path: '',
    component: SunnahHadithPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SunnahHadithPageRoutingModule {}
