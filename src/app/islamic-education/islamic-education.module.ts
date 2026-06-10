import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IslamicEducationPage } from './islamic-education.page';
import { IslamicEducationPageRoutingModule } from './islamic-education-routing.module';
import { SafeUrlPipe } from '../safe-url.pipe';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, IslamicEducationPageRoutingModule],
  declarations: [IslamicEducationPage, SafeUrlPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IslamicEducationPageModule {}
