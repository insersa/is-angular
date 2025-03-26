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

import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtModule } from '@auth0/angular-jwt';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { MessageService } from '../../error/services/message.service';
import { getTranslateModule } from '../../test';
import { UrlConfig } from '../../util/config';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service, http, backend;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ JwtModule.forRoot({}), RouterTestingModule, getTranslateModule(), LoggerTestingModule],
      providers: [ TokenService, HttpClient, HttpTestingController, UrlConfig, HttpHandler, MessageService ]
    });
  });

  beforeEach(async(inject([TokenService, HttpClient, HttpTestingController],
    (tokenService: TokenService, httpClient: HttpClient, mockBackend: HttpTestingController) => {
      service = tokenService;
      http = httpClient;
      backend = mockBackend;
    })));

  /*
  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));*/

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
