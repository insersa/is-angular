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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { UrlConfig } from '../../util/config';

import { FileComponent } from './components/file/file.component';
import { FileService } from './services/file.service';

@NgModule({
  declarations: [FileComponent],
  exports: [FileComponent],
  imports: [CommonModule, TranslateModule],
  providers: [FileService, provideHttpClient(withInterceptorsFromDi())],
})
export class FileModule {
  static forRoot(factory: () => { url: string }): ModuleWithProviders<FileModule> {
    return {
      ngModule: FileModule,
      providers: [{ provide: UrlConfig, useFactory: factory }],
    };
  }
}
