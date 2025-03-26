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

import { CodesList } from '../../../models/interfaces/code.interface';
import { TokenService } from '../../../user/services/token.service';
import { UrlConfig } from '../../../util/config';

@Injectable({
  providedIn: 'root',
})
export class CodeService {
  /* URL de service codes */
  private codeUrl: string;

  /* Les codes en cache*/
  private codes: CodesList = {};

  /* L'objet à retourner sur demande */
  private observable: Observable<any> | undefined;

  constructor(public http: HttpClient, urlConfig: UrlConfig, private token: TokenService) {
    this.codeUrl = `${urlConfig.url}/codes`;
  }

  getCodes(): Observable<CodesList> {
    if (Object.keys(this.codes).length > 0) {
      return of(this.codes);
    } else if (this.observable) {
      return this.observable;
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          token: this.token.token ? this.token.token : '',
        }),
      };
      this.observable = this.http.get<CodesList>(this.codeUrl, httpOptions).pipe(
        map((data: CodesList) => {
          this.codes = data;
          return this.codes;
        }),
        share()
      );
      return this.observable;
    }
  }

  resetCodes() {
    this.codes = {};
    this.observable = undefined;
  }
}
