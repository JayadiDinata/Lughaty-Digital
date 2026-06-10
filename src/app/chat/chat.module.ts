import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatPage } from './chat.page';
import { ChatPageRoutingModule } from './chat-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ChatPageRoutingModule],
  declarations: [ChatPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatPageModule {}
