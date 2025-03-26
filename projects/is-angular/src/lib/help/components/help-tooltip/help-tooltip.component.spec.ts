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
import { PopoverModule } from 'ngx-bootstrap/popover';
import { LoggerTestingModule } from 'ngx-logger/testing';

import { getTokenServiceStubProvider, getTranslateModule } from '../../../test';
import { getHelpServiceStubProvider } from '../../../test/help-configuration';
import { UrlConfig } from '../../../util/config';

import { HelpTooltipComponent } from './help-tooltip.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HelpTooltipComponent', () => {
  let component: HelpTooltipComponent;
  let fixture: ComponentFixture<HelpTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [HelpTooltipComponent],
    imports: [PopoverModule.forRoot(), getTranslateModule(), LoggerTestingModule],
    providers: [getHelpServiceStubProvider(), UrlConfig, getTokenServiceStubProvider(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
