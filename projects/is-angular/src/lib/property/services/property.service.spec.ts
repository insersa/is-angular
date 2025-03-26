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

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { getTokenServiceStubProvider } from '../../test';
import { UrlConfig } from '../../util/config';

import { PropertyService } from './property.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PropertyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [LoggerTestingModule],
    providers: [PropertyService, UrlConfig, getTokenServiceStubProvider(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([PropertyService], (service: PropertyService) => {
    expect(service).toBeTruthy();
  }));
});
