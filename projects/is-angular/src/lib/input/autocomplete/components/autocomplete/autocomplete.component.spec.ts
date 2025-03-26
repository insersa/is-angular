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

import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { of } from 'rxjs';

import { ObjectFieldsService } from '../../../../object/services/object-fields.service';
import { ObjectInitService } from '../../../../object/services/object-init.service';
import { ObjectService } from '../../../../object/services/object.service';
import {
  getPropertyServiceStubProvider,
  getTokenServiceStubProvider,
  getTranslateModule,
  getUserServiceStubProvider, ObjectFieldsServiceMock, ObjectInitServiceMock
} from '../../../../test';

import { AutocompleteComponent as AutocompleteComponentIS } from './autocomplete.component';

@Component({
  selector: 'is-mock-parent',
  template: `
    <is-autocomplete [(ngModel)]="value"
                     name="value"
                     idField="mun_id"
                     numberField="mun_number"
                     textField="mun_name"
                     [filter]="{'mun_delete_date': 'IS_NULL'}"
                     placeholderKey="municipality.placeholder.mun_id"
                     [required]="required"
                     [readonly]="readonly"
                     [disabled]="disabled"
                     [security]="security"
                     objectName="Municipality">
    </is-autocomplete>
    `
})
export class ParentComponent {
  @ViewChild(AutocompleteComponentIS) child;
  value = undefined;
  required = false;
  readonly = false;
  disabled = false;
  security = false;

  public ParentComponent() {}

}
describe('AutocompleteComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  // Mock object service
  const spyObjectService = jasmine.createSpyObj('spyObjectService', ['getList', 'getRecord']);

  // Mock getRecord response
  spyObjectService.getRecord.and.returnValue( of(
    {record: {mun_id: 1, mun_number: 1000, mun_name: 'Lausanne'}}));

  // Mock getList response
  spyObjectService.getList.and.returnValue( of({
    records: [{mun_id: 2, mun_number: 1008, mun_name: 'Prilly'}]}) );

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, AutoCompleteModule, getTranslateModule(), BrowserAnimationsModule, JwtModule, LoggerTestingModule],
      declarations: [ AutocompleteComponentIS, ParentComponent ],
      providers: [getTokenServiceStubProvider(), getPropertyServiceStubProvider(), NgControl,
        {provide: ObjectService, useValue: spyObjectService}, getUserServiceStubProvider(),
        {provide: ObjectFieldsService, useClass: ObjectFieldsServiceMock},
        {provide: ObjectInitService, useClass: ObjectInitServiceMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    spyOn(component.child, 'search');
    fixture.detectChanges();
  });

  afterEach( () => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable input for non-authorized user', () => {
    component.readonly = false;
    component.required = false;
    component.disabled = false;
    component.security = true;
    fixture.detectChanges();
    const divEl = fixture.nativeElement;
    const inputEl = divEl.querySelector('input');
    expect(inputEl.readOnly).toBe(true);
  });

  it('should not disable input if security is deactivated', () => {
    component.readonly = false;
    component.required = false;
    component.disabled = false;
    component.security = false;
    fixture.detectChanges();
    const divEl = fixture.nativeElement;
    const inputEl = divEl.querySelector('input');
    expect(inputEl.readOnly).toBe(false);
  });

  it('should initialise record', () => {
    component.value = 1;
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.child.item.number).toBe(1000);
      expect(component.child.item.text).toBe('Lausanne');
    });
  });

  /**
   * Pour tester le input sur un autocomplete primeng, il faut déclencher 'keydown' et 'input'
   * https://stackoverflow.com/questions/51707865/trigger-the-value-for-the-autocomplete-component-of-primeng-angular-2-4-during
   */
  it('single suggestion is automatically selected on blur', fakeAsync(() => {

    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('p-autocomplete')).query(By.css('input'));
    const inputEl = input.nativeElement;

    // 1. Search a municipality with query "Pri"
    inputEl.value = 'Pri';
    inputEl.dispatchEvent(new Event('keydown'));
    fixture.detectChanges();
    tick(400);  // Because the component triggers observables with 300 delay
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(400);
    expect(component.child.search).toHaveBeenCalled();

    fixture.whenStable().then(() => {
      expect(spyObjectService.getList).toHaveBeenCalled();
      expect(component.child.list.length).toBe(1);

      // 2. Blur
      inputEl.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      tick(400);
      expect(component.value).toBe(2);
    });
  }));

});
