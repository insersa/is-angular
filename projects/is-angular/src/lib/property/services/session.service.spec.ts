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

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set and retrieve a property', () => {
    service.setProperty('test', '123');
    expect(SessionService.getProperty('test')).toEqual('123');
  });

  it('subscribe and set', () => {
    service.onPropertyChange.subscribe( (event: any) => {
      expect(event.name).toEqual('test');
      expect(event.value).toEqual('321');
    });
    service.setProperty('test', '321');
  });
});
