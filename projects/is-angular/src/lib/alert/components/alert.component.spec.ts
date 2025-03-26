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


import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import {
  getTokenServiceStubProvider,
  getTranslateModule,
  getUserServiceStubProvider, UserMock,
  UserServiceMock
} from '../../test';
import { UserService } from '../../user/services/user.service';
import { AlertService } from '../services/alert.service';


import { AlertComponent } from './alert.component';


describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let user: UserServiceMock;

  // Mock code service with a message
  const spyAlertService = jasmine.createSpyObj('SpyAlertService', ['getAlertMessage']);
  spyAlertService.getAlertMessage.and.returnValue( of({id: 1, title: 'Test', text: 'A message', 'level': 'info'}) );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ getTranslateModule(), LoggerTestingModule],
      declarations: [ AlertComponent ],
      providers: [getTokenServiceStubProvider(), getUserServiceStubProvider(),
        {provide: AlertService, useValue: spyAlertService}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    user = fixture.debugElement.injector.get(UserService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Shows info icon when an info message exists', fakeAsync(() => {
    // Change user and trigger alert message
    user.user = new UserMock(2, 'Test 2');
    tick();
    // Test that message has been initialised
    expect(component.message['id']).toBeDefined();

  }));
});
