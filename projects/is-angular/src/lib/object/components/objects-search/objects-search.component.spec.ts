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
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

import { HttpErrorHandler } from '../../../error/services/http-error-handler.service';
import { MessageService } from '../../../error/services/message.service';
import { getTokenServiceStubProvider, getTranslateModule, getUserServiceStubProvider } from '../../../test';
import { getPropertyServiceStubProvider } from '../../../test/property-configuration';
import { UrlConfig } from '../../../util/config';
import { ObjectInitService } from '../../services/object-init.service';
import { ObjectService } from '../../services/object.service';

import { ObjectsSearchComponent } from './objects-search.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Mock parent
@Component({
  selector: 'is-mock-parent',
  template: `
        <is-objects-search (searched)="isSearch = true"
                           (data)="onData($event)"
                           (moredata)="onMoreData($event)"
                           #search
                           (datacount)="count = $event"
                           (loading) = "onLoading($event)">
        </is-objects-search>
    `
})
export class ParentComponent {
  @ViewChild(ObjectsSearchComponent) child;
  isSearch = false;
  list: any[] = [];
  count = 0;

  onData( object: {records: any[], ids: any[]}) {
    this.list = object.records;
  }

  // Mock methods
  onMoreData = () => {};
  onLoading = () => {};
}

describe('ObjectsSearchComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  // Mock services
  const spyObjectService = jasmine.createSpyObj('spyObjectService', ['getList', 'getListCount']);
  spyObjectService.getList.and.returnValue(
    of({records: [{aaa_id: 1, aaa_lastname: 'Ibrahimovic', aaa_firstname: 'Zlatan'}], ids: [1]}));
  spyObjectService.getListCount.and.returnValue(of({count: 1}));
  const spyObjectInitService = jasmine.createSpyObj('spyObjectInitService', ['getInitObject']);
  spyObjectInitService.getInitObject.and.returnValue(of({record: {aaa_profession: 'Football player'}}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ObjectsSearchComponent, ParentComponent],
    imports: [RouterTestingModule, FormsModule, getTranslateModule(), LoggerTestingModule],
    providers: [MessageService, getPropertyServiceStubProvider(), UrlConfig,
        { provide: ObjectService, useValue: spyObjectService },
        { provide: ObjectInitService, useValue: spyObjectInitService },
        getTokenServiceStubProvider(), getUserServiceStubProvider(), HttpErrorHandler, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;

    // Init type, sort
    component.child.type = 'AnExample';
    component.child.initSort = {'desc': 'aaa_update_date'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initialises data with initial sort', fakeAsync(() => {
    spyOn(component.child, 'initData').and.callThrough();
    spyOn(component, 'onData').and.callThrough();
    component.child.ngOnInit();
    tick();
    expect(spyObjectService.getList).toHaveBeenCalledWith('AnExample', {}, {desc: 'aaa_update_date'}, '1-12');
    expect(component.onData).toHaveBeenCalledTimes(1);
    expect(component.list).toEqual([{aaa_id: 1, aaa_lastname: 'Ibrahimovic', aaa_firstname: 'Zlatan'}]);
  }));

  it('Adds init criteria to the extended search query', fakeAsync(() => {
    spyOn(component.child, 'initData').and.callThrough();

    // Initialise component, including init criteria
    component.child.ngOnInit();
    tick();
    expect(component.child.initData).toHaveBeenCalled();
    expect(spyObjectInitService.getInitObject).toHaveBeenCalled();

    // Select extended search
    const toggleButton = fixture.debugElement.query(By.css('#toggleButton')).nativeElement;
    toggleButton.click();
    fixture.detectChanges();
    expect(component.child.extendedSearch).toEqual(true);

    // Search
    const searchButton = fixture.debugElement.query(By.css('#searchButton')).nativeElement;
    searchButton.click();
    fixture.detectChanges();

    tick();

    expect(spyObjectService.getList).toHaveBeenCalledWith(
      'AnExample', {aaa_profession: 'Football player'}, {desc: 'aaa_update_date'}, '1-12');
  }));

});
