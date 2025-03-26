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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

import { UrlConfig } from '../../util/config';

import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CodeComponent } from './components/code/code.component';
import { MulticodeComponent } from './components/multicode/multicode.component';
import { TextcodeComponent } from './components/textcode/textcode.component';
import { CodeService } from './services/code.service';

@NgModule({
  declarations: [CodeComponent, MulticodeComponent, TextcodeComponent, CheckboxComponent],
  exports: [CodeComponent, MulticodeComponent, TextcodeComponent, CheckboxComponent],
  imports: [CommonModule, FormsModule, AutoCompleteModule, CheckboxModule, RadioButtonModule, TranslateModule, PopoverModule.forRoot()],
  providers: [CodeService, PopoverConfig, provideHttpClient(withInterceptorsFromDi())],
})
export class CodeModule {
  static forRoot(factory: () => { url: string }): ModuleWithProviders<CodeModule> {
    return {
      ngModule: CodeModule,
      providers: [{ provide: UrlConfig, useFactory: factory }],
    };
  }
}
