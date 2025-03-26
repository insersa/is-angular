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
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { ObjectModule } from '../../../projects/is-angular/src/lib/object/object.module';
import { TableModule } from '../../../projects/is-angular/src/lib/table/table.module';
import { getJwtModule } from '../../../projects/is-angular/src/lib/test/jwt-configuration';
import { UrlConfig } from '../../../projects/is-angular/src/lib/util/config';

import { DataTestComponent } from './data-test.component';



describe('DataTestComponent', () => {
  let component: DataTestComponent;
  let fixture: ComponentFixture<DataTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TableModule, ObjectModule, getJwtModule(), LoggerTestingModule, RouterTestingModule ],
      declarations: [ DataTestComponent ],
      providers: [ UrlConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
