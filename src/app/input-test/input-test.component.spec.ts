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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { AutocompleteModule } from '../../../projects/is-angular/src/lib/input/autocomplete/autocomplete.module';
import { BooleanModule } from '../../../projects/is-angular/src/lib/input/boolean/boolean.module';
import { CalendarModule } from '../../../projects/is-angular/src/lib/input/calendar/calendar.module';
import {PipeModule} from '../../../projects/is-angular/src/lib/input/pipe/pipe.module';
import { TextModule } from '../../../projects/is-angular/src/lib/input/text/text.module';
import { ValidatorModule } from '../../../projects/is-angular/src/lib/input/validator/validator.module';
import { getTranslateModule } from '../../../projects/is-angular/src/lib/test';
import { getJwtModule } from '../../../projects/is-angular/src/lib/test/jwt-configuration';
import { UrlConfig } from '../../../projects/is-angular/src/lib/util/config';

import { InputTestComponent } from './input-test.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('InputTestComponent', () => {
  let component: InputTestComponent;
  let fixture: ComponentFixture<InputTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [InputTestComponent],
    imports: [FormsModule, TextModule, ValidatorModule, BooleanModule, AutocompleteModule, getTranslateModule(),
        PipeModule, getJwtModule(), LoggerTestingModule, RouterTestingModule, CalendarModule],
    providers: [UrlConfig, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
