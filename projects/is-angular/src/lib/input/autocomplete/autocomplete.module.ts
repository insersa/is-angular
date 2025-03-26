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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule as AutcCompleteModulePrimeNG } from 'primeng/autocomplete';

import { UrlConfig } from '../../util/config';

import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';

/**
 * Sélection d'un enregistrement métier avec autocomplete
 */
@NgModule({
  imports: [CommonModule, FormsModule, AutcCompleteModulePrimeNG, TranslateModule],
  exports: [AutocompleteComponent],
  declarations: [AutocompleteComponent],
})
export class AutocompleteModule {
  static forRoot(factory: () => { url: string }): ModuleWithProviders<AutocompleteModule> {
    return {
      ngModule: AutocompleteModule,
      providers: [{ provide: UrlConfig, useFactory: factory }],
    };
  }
}
