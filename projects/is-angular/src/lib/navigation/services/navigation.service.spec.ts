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

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { HttpErrorHandler } from '../../error/services/http-error-handler.service';
import { ObjectService } from '../../object/services/object.service';
import { getPropertyServiceStubProvider, ObjectServiceMock } from '../../test';
import { UrlConfig } from '../../util/config';



import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, LoggerTestingModule],
    providers: [{provide: ObjectService, useClass: ObjectServiceMock},
      UrlConfig, getPropertyServiceStubProvider(), HttpErrorHandler]
  }));


  it('should be created', () => {
    const service: NavigationService = TestBed.get(NavigationService);
    expect(service).toBeTruthy();
  });
});
