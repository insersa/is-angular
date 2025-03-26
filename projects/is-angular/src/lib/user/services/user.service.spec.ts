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
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';

import { HttpErrorHandler } from '../../error/services/http-error-handler.service';
import { getTokenServiceStubProvider, getTranslateModule } from '../../test/index';
import { UrlConfig } from '../../util/config';
import { User } from '../classes/user.model';

import { UserService } from './user.service';

describe('UserService', () => {
  let urlConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JwtModule, getTranslateModule(), RouterTestingModule],
      providers: [
        UrlConfig,
        UserService,
        getTokenServiceStubProvider(),
        HttpErrorHandler,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    urlConfig = TestBed.get(UrlConfig);
    urlConfig.url = '';
  });

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    // After every test, assert that there are no more pending requests.
    backend.verify();
  }));

  it('Contrôle du remplissage de infos dans User', async(
    inject([HttpTestingController, HttpClient, UserService], (backend: HttpTestingController, http: HttpClient, service: UserService) => {
      // queue up the http request in the backend request queue
      service.user = new User(6, 'inser', null, null, 'fr');
      service.onUserChange.subscribe((user: User) => {
        expect(service.user.info).toEqual({ sce: 851 });
      });

      // verify that there is now one (and only one) request queued up
      const req = backend.expectOne('/userinfos?user=inser');
      expect(req.request.method).toEqual('GET');

      // Satisfy the pending request in the mockHttp request queue
      req.flush({ sce: 851 });
    })
  ));
});
