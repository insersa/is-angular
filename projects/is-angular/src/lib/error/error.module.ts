/*
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library.
 */

import { CommonModule } from '@angular/common';
import { ErrorHandler, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MessagesComponent } from './components/messages/messages.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [MessagesComponent],
  exports: [MessagesComponent],
  providers: [HttpErrorHandler, MessageService, { provide: ErrorHandler, useClass: GlobalErrorHandlerService }],
})
export class ErrorModule {}
