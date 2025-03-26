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
import { ModuleWithProviders, NgModule } from '@angular/core';

import { UrlConfig } from '../util/config';

import { DocumentService } from './services/document.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [DocumentService],
})
export class DocumentModule {
  static forRoot(factory: () => { url: string }): ModuleWithProviders<DocumentModule> {
    return {
      ngModule: DocumentModule,
      providers: [{ provide: UrlConfig, useFactory: factory }],
    };
  }
}
