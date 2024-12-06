import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ChatComponent } from './app/chat/chat.component';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent],
  template: '<app-chat></app-chat>'
})
export class App {}

bootstrapApplication(App, appConfig);