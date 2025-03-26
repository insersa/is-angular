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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { CodeModule } from '../../../projects/is-angular/src/lib/input/code/code.module';
import { getTranslateModule } from '../../../projects/is-angular/src/lib/test';
import { getJwtModule } from '../../../projects/is-angular/src/lib/test/jwt-configuration';
import { UrlConfig } from '../../../projects/is-angular/src/lib/util/config';


import { CodetestComponent } from './codetest.component';

describe('CodetestComponent', () => {
  let component: CodetestComponent;
  let fixture: ComponentFixture<CodetestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslateModule(), CodeModule, FormsModule, getJwtModule(), LoggerTestingModule, RouterTestingModule],
      declarations: [ CodetestComponent ],
      providers: [ UrlConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodetestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
