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
import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { CheckboxModule } from 'primeng/checkbox';
import { of } from 'rxjs';

import { getTranslateModule, getUserServiceStubProvider } from '../../../../test';
import { UrlConfig } from '../../../../util/config';
import { CodeService } from '../../services/code.service';

import { MulticodeComponent } from './multicode.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  selector: 'is-mock-parent',
  template: `
        <is-multicode fieldname="app_status" [readonly]="readonly" [showPopup]="showPopup" [security]="security"
                      [shortcutCodes]="shortcutCodes" (selectShortcut)="selectShortcut($event)"
                      [(ngModel)]="selectedCodes">
        </is-multicode>
    `
})
export class ParentComponent {
  @ViewChild(MulticodeComponent) child;
  readonly = false;
  security = false;
  showPopup = true;
  selectedCodes = [];
  shortcutCodes = [
    {from: 1, to: 2, labelKey: 'status.untreated'},
    {from: 3, to: 4, labelKey: 'status.inprocess'},
    {from: 5, to: 6, labelKey: 'status.finished'}];
  public ParentComponent() {}

  selectShortcut = evt => {};
}

describe('MulticodeComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  // Mock code service with one code app_status
  const spyCodeService = jasmine.createSpyObj('SpyCodeService', ['getCodes']);
  spyCodeService.getCodes.and.returnValue( of({app_status: ['1', '2', '3', '4', '5', '6']}) );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [MulticodeComponent, ParentComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [getTranslateModule(),
        CheckboxModule,
        FormsModule,
        PopoverModule.forRoot(),
        LoggerTestingModule],
    providers: [{ provide: CodeService, useValue: spyCodeService }, UrlConfig, PopoverConfig, NgControl, getUserServiceStubProvider(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows bar with shortcut codes and the full list of codes', () => {
    expect(component.child.codes).toEqual(['1', '2', '3', '4', '5', '6']);

    // Shortcut codes
    const shortcuts = fixture.debugElement.queryAll(By.css('p-checkbox'));
    expect(shortcuts).toBeDefined();
    expect(shortcuts.length).toEqual(3);

    // Popover with all codes
    const popoverButton = fixture.debugElement.query(By.css('button'));
    expect(popoverButton).toBeDefined();
    popoverButton.nativeElement.click();
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.css('popover-container'));
    expect(popover).toBeDefined();
    const checkboxes = fixture.debugElement.queryAll(By.css('p-checkbox'));
    // Shortcuts + full list of codes = 9 checkboxes
    expect(checkboxes.length).toEqual(9);

  });

  it('shortcut selection selects a range of codes', () => {

    spyOn(component, 'selectShortcut');
    const shortcuts = fixture.debugElement.queryAll(By.css('.ui-chkbox-box'));
    shortcuts[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.child.selectedValues.length).toBeGreaterThan(0);
    expect(component.selectShortcut).toHaveBeenCalledWith(
      { from: 1, to: 2, checked: true, allCheckedValues: [ '1', '2' ] });
    expect(component.selectedCodes).toEqual(['1', '2']);

  });

});
