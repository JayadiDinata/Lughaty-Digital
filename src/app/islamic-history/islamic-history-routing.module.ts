import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IslamicHistoryPage } from './islamic-history.page';

const routes: Routes = [
  {
    path: '',
    component: IslamicHistoryPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IslamicHistoryPageRoutingModule {}
