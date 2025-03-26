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
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { HandleError, HttpErrorHandler } from '../../error/services/http-error-handler.service';
import { URL_CONFIG_TOKEN } from '../../util/config';
import { User } from '../classes/user.model';

import { TokenService } from './token.service';

export interface UserInfo {
  [key: string]: string | number | boolean;
}

/**
 * Service to manage the current user.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * An EventEmitter to listen to user change events.
   *
   */
  onUserChange: EventEmitter<User> = new EventEmitter<User>();

  /**
   * The current user.
   */
  private _currentUser: User | undefined;

  private handleError: HandleError;

  /**
   * Constructor.
   *
   * @param url the base url
   * @param http the http service
   */
  constructor(
    @Inject(URL_CONFIG_TOKEN) protected url: string,
    @Inject(HttpClient) protected http: HttpClient,
    protected token: TokenService,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  /**
   * Get the current user.
   *
   * @returns the current user
   */
  get currentUser(): User | undefined {
    return this._currentUser;
  }

  /**
   * Set the current user.
   *
   * @param user the new user
   */

  set currentUser(user: User | undefined) {
    this._currentUser = user;
    this.onUserChange.emit(this._currentUser);
    if (this._currentUser) {
      this.getInfo$().subscribe((info) => {
        if (this._currentUser) {
          this._currentUser.info = info;
          this.onUserChange.emit(this._currentUser);
        }
      });
    }
  }

  /**
   * Set the info for the user.
   *
   * @param info the info for the user
   */
  set info(info: UserInfo) {
    if (this._currentUser) {
      this._currentUser.info = info;
      this.onUserChange.emit(this._currentUser);
    }
  }

  /**
   * Updates user status (ex. from INITIAL_LOGON to VALID)
   *
   */
  set status(status: string) {
    if (this._currentUser) {
      this._currentUser.status = status;
      this.onUserChange.emit(this._currentUser);
    }
  }

  /**
   * Revert the info for the user from the server.
   */
  public revertInfo() {
    this.getInfo$(true).subscribe((info) => {
      if (this._currentUser) {
        this._currentUser.info = info;
        this.onUserChange.emit(this._currentUser);
      }
    });
  }

  /**
   * Get the info for the current user from the server.
   * @param refresh Refresh the user info in the server cache before returning it
   * @returns the info for the current user
   */
  protected getInfo$(refresh?: boolean): Observable<UserInfo> {
    if (!this._currentUser) {
      return of({
        // Default values for UserInfo fields
        // Example: name: '', age: 0, etc.
      } as UserInfo);
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    let url = `${this.url}/userinfos?user=${this._currentUser.username}`;
    if (refresh) {
      url = `${url}&refresh=true`;
    }
    return this.http.get<UserInfo>(url, httpOptions).pipe(
      map((res) => {
        this.token.token = <string>res.token;
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.handleError<UserInfo>('getInfo', [], {})(error))
    );
  }
}
