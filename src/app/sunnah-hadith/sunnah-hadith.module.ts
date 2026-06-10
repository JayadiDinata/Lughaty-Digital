import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SunnahHadithPage } from './sunnah-hadith.page';
import { SunnahHadithPageRoutingModule } from './sunnah-hadith-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SunnahHadithPageRoutingModule],
  declarations: [SunnahHadithPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SunnahHadithPageModule {}
