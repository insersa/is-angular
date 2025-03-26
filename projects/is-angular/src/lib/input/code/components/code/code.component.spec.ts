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
import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';

import { getTranslateModule, getUserServiceStubProvider } from '../../../../test';
import { CodeServiceMock } from '../../../../test/code-configuration';
import { UrlConfig } from '../../../../util/config';
import { CodeService } from '../../services/code.service';

import { CodeComponent } from './code.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('CodeComponent', () => {
  let component: CodeComponent;
  let fixture: ComponentFixture<CodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [CodeComponent],
    imports: [FormsModule, getTranslateModule(), RadioButtonModule, AutoCompleteModule, LoggerTestingModule],
    providers: [{ provide: CodeService, useClass: CodeServiceMock }, UrlConfig,
        NgControl, getUserServiceStubProvider(), ChangeDetectorRef, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable input for non-authorized user', () => {
    component.readonly = false;
    component.required = true;
    component.disabled = false;
    component.security = true;
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      const selectEl = fixture.debugElement.query(By.css('select'));
      expect(selectEl.nativeElement.disabled).toBe(true);
    });
  });

  it('should not disable input if security is deactivated', () => {
    component.readonly = false;
    component.required = false;
    component.disabled = false;
    component.security = false;
    fixture.detectChanges();
    const divEl = fixture.nativeElement;
    const selectInputEl = divEl.querySelector('select');
    expect(selectInputEl.disabled).toBe(false);
  });

});
