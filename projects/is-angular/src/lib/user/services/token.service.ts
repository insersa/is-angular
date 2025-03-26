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

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MessageService } from '../../error/services/message.service';
import { URL_CONFIG_TOKEN } from '../../util/config';

/**
 * Service to get a token from the backend and manage it in the session storage.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  /**
   * Nom de la clé dans le sessionStorage
   */
  private tokenKey: string | undefined;

  /**
   * Service constructor.
   *
   * @param url the base url
   * @param http the http service
   * @param jwtHelper the JWT helper service
   * @param logger the logger service
   * @param message the message service
   */
  constructor(
    @Inject(URL_CONFIG_TOKEN) private url: string,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private logger: NGXLogger,
    private message: MessageService
  ) {}

  /**
   * Get a new token.
   *
   * @param username the username
   * @param password the password
   *
   * @returns the new toke, <code>null</code> if it was impossible to get it
   */
  newToken(username: string, password: string): Observable<string> {
    this.logger.debug('Get the token for user', username);
    this.remove();
    this.message.clear();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http.post(`${this.url}/token`, { username, password }, httpOptions).pipe(
      map((data: any) => {
        this.token = data['token'];
        return data['token'];
      }),
      // Bind the context so that injected dependencies are defined
      // https://stackoverflow.com/questions/42956852/angular-2-injected-service-is-undefined/42960468
      catchError(this.handleHttpError.bind(this))
    );
  }

  /**
   * Treats the http response error
   * Code 401 should display an error message, not redirect to the login page
   * @param error error response
   * @returns le code d'erreur
   */
  private handleHttpError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent || error.status === 500) {
      this.message.add('error', 'message.general.error');
    } else {
      this.message.add('error', 'message.auth.error');
    }
    return of(null);
  }

  /**
   * Remove the token.
   */
  remove(): void {
    // sessionStorage.removeItem(this.property.properties['security.token.storage.key']);
    if (this.tokenKey) {
      sessionStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Check if the token is expired.
   *
   * @returns <code>true</code> if the token is expired
   */
  isExpired(): boolean {
    return !this.token || this.jwtHelper.isTokenExpired(this.token);
  }

  /**
   * Decode the token.
   *
   * @returns the object serialized in the token
   */
  decode(): any {
    return this.token !== undefined ? this.jwtHelper.decodeToken(this.token) : undefined;
  }

  /**
   * Get the token from the session storage.
   *
   * @returns the token or null
   */
  get token(): string | undefined {
    // return sessionStorage.getItem(this.property.properties['security.token.storage.key']);
    if (this.tokenKey) {
      return <string | undefined>sessionStorage.getItem(this.tokenKey);
    }
    return undefined;
  }

  /**
   * Store the token in the session storage.
   *
   * @param token the token
   */
  set token(token: string | undefined) {
    if (token && this.tokenKey) {
      // sessionStorage.setItem(this.property.properties['security.token.storage.key'], token);
      sessionStorage.setItem(this.tokenKey, token);
    } else {
      this.remove();
    }
  }

  /**
   * Injection de la clé pour le sessionStorage
   *
   * @param name Nom du paramètre
   */
  /* The `setTokenKey(name: string)` method in the `TokenService` class is used to set the name of the
  key that will be used to store the token in the session storage. This method allows you to specify
  a custom key name for storing the token instead of using a default key. By calling this method and
  providing a string parameter, you can set the custom key name to be used for storing and
  retrieving the token in the session storage. */
  setTokenKey(name: string) {
    this.tokenKey = name;
  }

  /**
   * Envoi de l'événement logout au serveur (optionnel)
   * Par exemple, pour enregistrer l'heure de logout
   */
  logout() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token ? this.token : '',
      }),
    };
    return this.http.delete(`${this.url}/token`, httpOptions).pipe(
      map(() => {
        return null;
      }),
      catchError((error) => {
        this.logger.error('TokenService.handleLogoutError - Logout error at server: ', error.status);
        return of(null);
      })
    );
  }

  /**
   * Treats the http response error
   * Code 401 should display an error message, not redirect to the login page
   * @param error error response
   * @returns le code d'erreur
   */
  public handleLogoutError(error: HttpErrorResponse): Observable<any> {
    this.logger.error('TokenService.handleLogoutError - Logout error at server: ', error.status);
    return of(null);
  }
}
