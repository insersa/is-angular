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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MissingTranslationHandlerParams, TranslateLoader } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenService } from '../user/services/token.service';

/**
 * Load the translation from a REST services instead from a assets file and manage the log of missing translations.
 */
export class TranslateRestLoader implements TranslateLoader {
  /**
   * <code>true</code> if the loader has loaded a language different to <code>'empty'</code>.
   */
  private loaded = false;

  /**
   * The missing key per language.
   */
  private missing = new Map<string, string[]>();

  /**
   * Constructor if not specified the REST service 'translate' must be at the root of the server.
   *
   * @param http to make the requests
   * @param url the service URL
   */
  constructor(private http: HttpClient, private logger: NGXLogger, private url: string = '/translate', private token: TokenService) {}

  /**
   * Get the translations from a REST service and set the loaded property if the language is different from <code>'empty'</code>.
   *
   * @param lang the language
   * @returns the translations
   */
  public getTranslation(lang: string): Observable<any> {
    // -- Charger le token si possible (sans token réception non complète des traductions)
    let options;
    if (this.token && this.token.token) {
      options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          token: this.token.token,
        }),
      };
    }

    // -- Charger les traductions
    this.loaded = false;
    return this.http.get(this.url + '/' + lang, options).pipe(
      map((data: any) => {
        // -- Reprise du nouveau token si présent
        if (data.token) {
          this.token.token = data.token;
        }

        // -- Mise des données de traductions
        this.loaded = lang !== 'empty';
        return data;
      })
    );
  }

  /**
   * Log a missing key if the language is loaded and the key has not jet been logged.
   *
   * @param params the missing translation parameters
   */
  public logMissing(params: MissingTranslationHandlerParams): void {
    // Le contrôle pour ne pas tracer les .undefined est pour les codes. Le numéro du code n'est pas toujours disponible
    // et si c'est le cas, ça va envoyer des logs d'erreurs dans la consol
    if (this.loaded && !params.key.endsWith('.undefined')) {
      // Check the language
      if (!this.missing.has(params.translateService.currentLang)) {
        this.missing.set(params.translateService.currentLang, new Array(0));
      }

      // Check the key
      const missingLang = this.missing.get(params.translateService.currentLang);
      if (missingLang && missingLang.indexOf(params.key) < 0) {
        missingLang.push(params.key);
        this.logger.warn(`Missing translation: key=${params.key} lang=${params.translateService.currentLang}`);
      }
    }
  }
}
