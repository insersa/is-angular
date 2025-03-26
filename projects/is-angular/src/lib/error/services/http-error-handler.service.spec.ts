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

import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { getTranslateModule } from '../../test';

import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';


describe('HttpErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslateModule(), RouterTestingModule],
      providers: [HttpErrorHandler, MessageService]
    });
  });

  it('should be created', inject([HttpErrorHandler], (service: HttpErrorHandler) => {
    expect(service).toBeTruthy();
  }));
});
