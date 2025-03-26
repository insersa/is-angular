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
import { FormsModule, NgControl } from '@angular/forms';
import { CalendarModule as CalendarModulePrimeNG } from 'primeng/calendar';

import { getTranslateModule, getUserServiceStubProvider } from '../../../../test';
import { UrlConfig } from '../../../../util/config';
import { PipeModule } from '../../../pipe/pipe.module';

import { CalendarComponent } from './calendar.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [CalendarComponent],
    imports: [FormsModule, CalendarModulePrimeNG, getTranslateModule(), PipeModule],
    providers: [UrlConfig, getUserServiceStubProvider(), NgControl, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable input for non-authorized user', () => {
    component.readonly = false;
    component.required = false;
    component.security = true;
    fixture.detectChanges();
    const divEl = fixture.nativeElement;
    const inputEl = divEl.querySelector('input');
    expect(inputEl.disabled).toBe(true);
  });

  it('should not disable input if security is deactivated', () => {
    component.readonly = false;
    component.required = false;
    component.security = false;
    fixture.detectChanges();
    const divEl = fixture.nativeElement;
    const inputEl = divEl.querySelector('input');
    expect(inputEl.disabled).toBe(false);
  });

});
