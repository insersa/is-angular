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
import { LoggerTestingModule } from 'ngx-logger/testing';
import { CalendarModule } from 'primeng/calendar';

import { AlertModule } from '../../../projects/is-angular/src/lib/alert/alert.module';
import { getTranslateModule } from '../../../projects/is-angular/src/lib/test';

import { DiversComponent } from './divers.component';

describe('DiversComponent', () => {
  let component: DiversComponent;
  let fixture: ComponentFixture<DiversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, CalendarModule, getTranslateModule(), LoggerTestingModule, AlertModule ],
      declarations: [ DiversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
