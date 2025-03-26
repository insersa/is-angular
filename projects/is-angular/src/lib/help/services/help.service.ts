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
 * Service that provides the short and long help texts for input labels
 */
@Injectable({
  providedIn: 'root',
})
export class HelpService {
  /* URL of the help resource */
  private url: string;

  /* The help texts in cache */
  private helptexts: any;

  /* The observable for the help texts */
  private observable: Observable<any> | undefined;

  constructor(private http: HttpClient, urlConfig: UrlConfig, private token: TokenService) {
    this.url = urlConfig.url + '/help';
  }

  getHelp(): Observable<any> {
    if (!this.token.token) {
      return of(null);
    }
    if (this.helptexts) {
      return of(this.helptexts);
    } else if (this.observable) {
      return this.observable;
    } else {
      const httpOptions = {
        headers: new HttpHeaders({
          token: this.token.token,
        }),
      };
      this.observable = this.http.get(this.url, httpOptions).pipe(
        map((result) => {
          this.helptexts = result;
          return this.helptexts;
        }),
        share()
      );
      return this.observable;
    }
  }

  reset() {
    this.helptexts = undefined;
    this.observable = undefined;
  }
}
