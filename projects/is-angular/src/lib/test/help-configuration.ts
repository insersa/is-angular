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

/**
 * Mock du service Help qui cherche les aides sur les libellés
 */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HelpService } from '../help/services/help.service';

@Injectable()
export class HelpServiceMock {
  constructor() {}

  getHelp(): Observable<any> {
    return of({});
  }

  reset() {}
}

/**
 * Configurer le stub pour le service help à mettre dans le providers
 *
 * @returns provider pour help service avec classe mock
 */
export function getHelpServiceStubProvider(): any {
  return { provide: HelpService, useClass: HelpServiceMock };
}
