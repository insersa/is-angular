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
import { Inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHandler, HandleError } from '../../error/services/http-error-handler.service';
import { URL_CONFIG_TOKEN } from '../../util/config';
import { Permission } from '../classes/permission.model';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private handleError: HandleError;

  /**
   * Service constructor.
   *
   * @param urlConfig the base url
   * @param http the http service
   * @param logger the logger service
   */
  constructor(
    @Inject(URL_CONFIG_TOKEN) protected baseUrl: string,
    protected http: HttpClient,
    protected logger: NGXLogger,
    protected tokenService: TokenService,
    protected errorHandler: HttpErrorHandler
  ) {
    this.handleError = this.errorHandler.createHandleError('PermissionService');
  }

  protected createHttpHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: `${this.tokenService.token}`,
      }),
    };
  }

  getUserPermissions$(username: string): Observable<Permission | undefined> {
    const options = this.createHttpHeaders();
    return this.http.get<Permission>(`${this.baseUrl}/permissions?user=${username}`, options).pipe(
      catchError(this.handleError('fetchUserPermissions', [401])),
      catchError((error) => {
        this.logger.error('Error fetching permissions', error);
        return of(undefined);
      })
    );
  }
}
