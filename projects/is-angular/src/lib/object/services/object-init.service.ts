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
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { TokenService } from '../../user/services/token.service';
import { UrlConfig } from '../../util/config';

/**
 * Service pour initialiser un objet métier selon pages: search, create
 */
@Injectable({
  providedIn: 'root',
})
export class ObjectInitService {
  /** Infos demandés en cache
   *
   * http://www.syntaxsuccess.com/viewarticle/caching-with-rxjs-observables-in-angular-2.0
   * */
  private cache: any = { create: {}, search: {} };
  private observables: any = { create: {}, search: {} };

  constructor(public http: HttpClient, private token: TokenService, private urlConfig: UrlConfig) {}

  /**
   * Cherche un objet métier vierge selon mode
   * @param type nom de l'objet métier
   * @param mode 'search' ou 'create'
   * @returns object vierge
   */
  public getInitObject(type: string, mode: string): Observable<any> {
    if (this.cache[mode][type]) {
      return of(this.cache[mode][type]);
    }
    if (this.observables[mode][type]) {
      return this.observables[mode][type];
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    this.observables[mode][type] = this.http.get(`${this.urlConfig.url}/initobject/${type}/${mode}`, httpOptions).pipe(
      map((result: any) => {
        this.token.token = result['token'];
        this.cache[mode][type] = result;
        return result;
      }),
      share()
    );
    return this.observables[mode][type];
  }
}
