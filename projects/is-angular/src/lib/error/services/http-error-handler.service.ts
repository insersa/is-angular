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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = <T extends Record<string, unknown> | undefined = undefined>(
  operation?: string,
  skip?: any[],
  result?: T
) => (error: HttpErrorResponse) => Observable<T>;

/** Handles HttpClient errors */
@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandler {
  constructor(private messageService: MessageService, private router: Router) {}

  /** Create curried handleError function that already knows the service name */
  createHandleError =
    <T extends Record<string, unknown> | undefined = undefined>(serviceName = '') =>
    (operation = 'operation', skip: any[] = [], result: T = {} as T) =>
      this.handleError(serviceName, operation, skip, result);

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param skip - list of error codes to skip in this handler, to be captured elsewhere
   * @param result - optional value to return as the observable result
   */
  handleError<T extends Record<string, unknown> | undefined = undefined>(
    serviceName = '',
    operation = 'operation',
    skip: any[] = [],
    result: T = {} as T
  ): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(serviceName, operation, error); // log to console instead

      if (error.error instanceof ErrorEvent) {
        // The http request did not reach the server
        this.messageService.add('error', 'message.general.error');
      } else {
        // The server responded with an error code

        // Test if the error code should be passed on
        if (skip.indexOf(error.status) >= 0) {
          throw error;
        }

        // Handle error
        this.handleHttpErrorCode(error);
        if (result && Object.keys(result).length === 0 && (<any>result).constructor === Object) {
          (<any>result).status = error.status;
        }
      }

      // Let the app keep running by returning a safe result.
      return of(result);
    };
  }

  /**
   * Affiche un message d'erreur selon statut de réponse http
   */
  private handleHttpErrorCode(err: any): void {
    this.messageService.clear();
    let errorKey = '';
    if (err.error && err.error.message) {
      errorKey = err.error.message;
    } else {
      switch (err.status) {
        case 304:
          // Nothing modified
          return;
        case 401:
          this.router.navigate(['/']);
          return;
        case 403:
          errorKey = 'message.forbidden.error';
          break;
        case 409:
          errorKey = 'message.concurrent.error';
          break;
        default:
          errorKey = 'message.general.error';
      }
    }
    this.messageService.add('error', errorKey);
  }
}
