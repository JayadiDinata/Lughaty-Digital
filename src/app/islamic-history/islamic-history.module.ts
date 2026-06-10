import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IslamicHistoryPage } from './islamic-history.page';
import { IslamicHistoryPageRoutingModule } from './islamic-history-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, IslamicHistoryPageRoutingModule],
  declarations: [IslamicHistoryPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IslamicHistoryPageModule {}
