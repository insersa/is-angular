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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { getJwtModule } from '../../projects/is-angular/src/lib/test/jwt-configuration';
import { UrlConfig } from '../../projects/is-angular/src/lib/util/config';

import { AppComponent } from './app.component';

import { IsAngularModule , getTranslateModule } from 'is-angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';




describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [
        AppComponent
    ],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [IsAngularModule,
        getTranslateModule(),
        LoggerTestingModule,
        RouterTestingModule,
        getJwtModule()],
    providers: [UrlConfig, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
  it(`should have as title 'IS-ANGULAR'`, async(() => {
    expect(component.title).toEqual('IS-ANGULAR');
  }));
  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('DEMO');
  }));
});
