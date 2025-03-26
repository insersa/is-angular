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

import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

/**
 * Handler for uncaught client errors. The logger sends the error to the server, if the loggee has been configured with
 * a server url and server log level in the project app.module.ts
 *
 * See example at https://github.com/dbfannin/ngx-logger
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any) {
    const logger = this.injector.get(NGXLogger);
    const message = error.message ? error.message : error.toString();

    logger.debug('GlobalErrorHandler.handleError. Uncaught error. Name: ', error.name, 'Message: ', message);
    logger.error(error.stack);

    // Instead of re-throwing the error, the user could be redirected to an error page
    // See example at https://medium.com/@aleixsuau/error-handling-angular-859d529fa53a
    throw error;
  }
}
