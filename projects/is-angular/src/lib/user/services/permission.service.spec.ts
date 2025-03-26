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

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { HttpErrorHandler } from '../../error/services/http-error-handler.service';
import { getTokenServiceStubProvider, getTranslateModule, urlConfigFactory } from '../../test';
import { UrlConfig } from '../../util/config';
import { Permission } from '../classes/permission.model';
import { PermissionService } from '../services/permission.service';
import { UserModule } from '../user.module';

describe('PermissionService', () => {
  let service, http, backend, urlConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [UserModule.forRoot(urlConfigFactory), JwtModule,
        getTranslateModule(), RouterTestingModule, LoggerTestingModule],
    providers: [PermissionService, UrlConfig, getTokenServiceStubProvider(), HttpErrorHandler, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    urlConfig = TestBed.get(UrlConfig);
    urlConfig.url = '';
    service = TestBed.get(PermissionService);
    http = TestBed.get(HttpClient);
    backend = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Fetches user permissions', () => {

      const permData = new Permission({menus: ['Home']});
      // queue up the http request in the backend request queue
      service.permissions('adam').subscribe( (data) => {
        expect(data).toEqual(permData);
      });

      // verify that there is now one (and only one) request queued up
      const req = backend.expectOne('/permissions?user=adam');
      expect(req.request.method).toEqual('GET');

      // Satisfy the pending request in the mockHttp request queue
      req.flush(new Permission({menus: ['Home']}));
      // req.flush({menus: ['Home']});
    });
});
