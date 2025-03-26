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


import { ChangeDetectorRef, Injectable } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { BehaviorSubject, of } from 'rxjs';

import { MessageService } from '../../../error/services/message.service';
import {
  getTranslateModule,
  getUserServiceStubProvider,
  ObjectFieldsServiceMock, ObjectInitServiceMock
} from '../../../test';
import { getNavigationServiceStubProvider } from '../../../test/navigation-configuration';
import { ObjectFieldsService } from '../../services/object-fields.service';
import { ObjectInitService } from '../../services/object-init.service';
import { ObjectService } from '../../services/object.service';
import { Mode , ObjectDetailComponent } from '../object-detail/object-detail.component';

/**
 * Solution for testing code inside a route.params.subsscribe clause
 * You need to simulate the activated route
 * https://stackoverflow.com/questions/42052225/how-to-unit-test-angular-2-routing-params
 * https://stackoverflow.com/questions/42776741/angular-2-jasmine-updating-an-activated-route-params-subscription-within-each-d
 */
@Injectable()
class MockActivatedRoute {
  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // Test parameters
  private _testParams: any;
  get testParams() { return this._testParams; }
  set testParams(params: any) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams, queryParams: {} };
  }
  // ActivatedRoute.parent.params
  get parent() {
    return { params: this.subject.asObservable() };
  }
}

/**
 * Test routes
 */
const testRoutes = [
  {path: 'users/:id', component: ObjectDetailComponent},
  {path: 'users/new', component: ObjectDetailComponent}
];

describe('ObjectDetailComponent', () => {
  let component: ObjectDetailComponent;
  let fixture: ComponentFixture<ObjectDetailComponent>;
  let route: MockActivatedRoute;

  // Mock services
  const spyObjectService = jasmine.createSpyObj('spyObjectService', ['getRecord', 'submit']);
  spyObjectService.getRecord.and.returnValue(of(
    {record: {use_id: 12, use_lastname: 'Ibrahimovic', use_firstname: 'Zlatan'}}));
  spyObjectService.submit.and.returnValue(of({record: {id: 13, use_lastname: 'Obama', use_firstname: 'Barack'}}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ getTranslateModule(), RouterTestingModule.withRoutes(testRoutes), LoggerTestingModule, FormsModule],
      declarations: [ ObjectDetailComponent ],
      providers: [ getUserServiceStubProvider(),
        { provide: ActivatedRoute, useClass: MockActivatedRoute},
        {provide: ObjectService, useValue: spyObjectService},
        {provide: ObjectFieldsService, useClass: ObjectFieldsServiceMock}, getNavigationServiceStubProvider(),
        {provide: ObjectInitService, useClass: ObjectInitServiceMock}, ChangeDetectorRef, MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDetailComponent);
    component = fixture.componentInstance;
    route = fixture.debugElement.injector.get(ActivatedRoute) as any;
    route.testParams = ({id: 12});
    fixture.detectChanges();
  });

  afterEach( () => {TestBed.resetTestingModule(); });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('A record is initialised from route parameters', fakeAsync(() => {
    spyOn(component, 'refreshRecord').and.callThrough();
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.refreshRecord).toHaveBeenCalled();
    expect(component.record['use_id']).toBe(12);
    expect(component.record['use_firstname']).toBe('Zlatan');
    fixture.whenStable().then(() => {
      const firstNameElem = fixture.debugElement.query(By.css('#firstName')).nativeElement;
      expect(firstNameElem.value).toBe('Zlatan');
      expect(firstNameElem.readOnly).toBe(true);
    });
  }));

  it('Form submission is blocked when there are validation errors', fakeAsync(() => {
    component.mode = Mode.Edit;
    fixture.detectChanges();

    // Modify a required field to null
    const firstNameElem = fixture.debugElement.query(By.css('#firstName')).nativeElement;
    firstNameElem.value = null;
    fixture.detectChanges();
    tick();

    // Submit
    const button = fixture.debugElement.query(By.css('#submitButton'));
    const buttonElem = button.nativeElement;
    buttonElem.click();

    fixture.whenStable().then( () => {
      fixture.detectChanges();

      // Assert
      expect (fixture.debugElement.query(By.css('#firstName')).nativeElement.value).toBeUndefined();
      expect(component.form.valid).toBeFalsy();
      expect(component.messages.messages.length).toBe(1);
      expect(component.messages.messages[0]['severity']).toBe('error');
    });

  }));

  it('A confirmation message is broadcasted after successful submission', async(() => {
    // Set edit mode
    component.mode = Mode.Edit;
    fixture.detectChanges();

    // Modify a field
    const firstNameElem = fixture.debugElement.query(By.css('#firstName')).nativeElement;
    firstNameElem.value = 'Donna';
    firstNameElem.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(firstNameElem.value).toBe('Donna');

    // Submit
    const button = fixture.debugElement.query(By.css('#submitButton'));
    const buttonElem = button.nativeElement;
    buttonElem.click();

    fixture.whenStable().then( () => {
      fixture.detectChanges();

      // Assert
      const messages = component.messages.messages;
      expect(messages.length).toBe(1);
      expect(messages[0]['severity']).toBe('success');
    });
  }));
});
