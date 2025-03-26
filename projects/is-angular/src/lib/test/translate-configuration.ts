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

import { getTestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

/*********** TRANSLATE CONFIGURATION ***********/
/**
 * Fichier de traduction
 */
const translations: any = {
  buildings: {
    title: 'Bâtiments',
  },
};

/**
 * Mock du loader pour le module de traduction
 */
class FakeLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<any> {
    return of(translations);
  }
}

/**
 * Configuration du module de traduction
 *
 * @returns  retourne un array avec les informations pour l'injection du translate
 */
export function getTranslateModule(): any {
  return TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useClass: FakeLoader,
    },
  });
}

/**
 * Set de la langue
 * @returns  traduction des key -> text des traduction
 */
export function setTranslateLang(lang: string): any {
  // Insérer la langue
  const injector = getTestBed();
  const translate = injector.get(TranslateService);
  translate.use(lang);

  return translations;
}

export class TranslateConfiguration {}
