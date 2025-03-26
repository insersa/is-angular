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

import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CodeService } from '../input/code/services/code.service';

/*********************** CODE SERVICE MOCK *************************/
@Injectable()
export class CodeServiceMock {
  getCodes(): Observable<any> {
    return of({});
  }
}

/**
 * Configurer le stub pour le service
 *
 */
export function getCodeServiceStubProvider(): any {
  return { provide: CodeService, useClass: CodeServiceMock };
}

/*********************** CODE MODULE MOCK *************************/
@NgModule({
  providers: [{ provide: CodeService, useClass: CodeServiceMock }],
})
/**
 * Module mock pour les services des codes.
 */
export class CodeModuleMock {}
