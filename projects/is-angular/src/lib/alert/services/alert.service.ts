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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TokenService } from '../../user/services/token.service';
import { UrlConfig } from '../../util/config';

/**
 * Service that provides the current alert message if there is one, info or warn
 */
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**
   * The service name.
   */
  private service = 'alert';

  constructor(private http: HttpClient, private token: TokenService, private urlConfig: UrlConfig) {}

  /**
   * Get the current alert message, if there is one
   * @param lang language of the message
   * @param egid the building id
   * @returns the new building id
   */
  public getAlertMessage(lang: string): Observable<any> {
    const headers = new HttpHeaders({
      token: this.token.token ? this.token.token : '',
    });
    const url = `${this.urlConfig.url}/${this.service}/${lang}`;
    return this.http.get(url, { headers: headers, observe: 'response' }).pipe(
      map((response) => {
        if (response.headers.get('token')) {
          this.token.token = <string>response.headers.get('token');
        }
        return response.body;
      }),
      (error) => {
        return error;
      }
    );
  }
}
