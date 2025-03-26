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

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LoggerTestingModule } from 'ngx-logger/testing';
import {of} from 'rxjs';

import { MessageService } from '../../../error/services/message.service';
import { getTranslateModule } from '../../../test';
import { ObjectFieldsServiceMock } from '../../../test/object-configuration';
import { ObjectFieldsService } from '../../services/object-fields.service';
import { ObjectService } from '../../services/object.service';

import { ObjectChildComponent } from './object-child.component';


// Mock parent
@Component({
  selector: 'is-mock-parent',
  template: `
    <form #form="ngForm" novalidate>
      <is-object-child #child1 [create]="create" [record]="recordChild1" index="0" [(working)]="working"></is-object-child>
      <is-object-child #child2 [create]="create" [record]="recordChild2" index="1" [(working)]="working"></is-object-child>
    </form>
    `
})
export class ParentComponent {
  @ViewChild('child1') child1;
  @ViewChild('child2') child2;
  create = false;
  recordChild1 = {};
  recordChild2 = {};
  working = false;
}
describe('ObjectChildComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  // Mock object service
  const spyObjectService = jasmine.createSpyObj('spyObjectService', ['getRecord', 'submit']);
  spyObjectService.getRecord.and.returnValue(of(
    {record: {aaa_id: 1, aaa_streetname: 'Bond street', aaa_city: 'London'}}));
  spyObjectService.submit.and.returnValue(of(
    {record: {aaa_id: 1, aaa_streetname: 'Bond street', aaa_city: 'London'}}));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, getTranslateModule(), LoggerTestingModule ],
      declarations: [ ObjectChildComponent, ParentComponent ],
      providers: [ ChangeDetectorRef, MessageService,
        {provide: ObjectFieldsService, useClass: ObjectFieldsServiceMock},
        {provide: ObjectService, useValue: spyObjectService}]
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

  it('When one child is edited, the other children are disabled', fakeAsync(() => {
    // Initial state
    component.child1.idField = 'aaa_id';
    component.child1.objectName = 'AnExample';
    component.child2.idField = 'aaa_id';
    component.child2.objectName = 'AnExample';
    component.recordChild1 = {aaa_id: 1, aaa_streetname: 'Bondd street', aaa_city: 'London'};
    component.recordChild2 = {aaa_id: 2, aaa_streetname: 'Baker street', aaa_city: 'London'};
    fixture.detectChanges();
    component.child1.ngOnInit();
    component.child2.ngOnInit();
    fixture.detectChanges();

    expect(component.child1.readonly).toEqual(true);
    expect(component.child1.create).toEqual(false);

    // Start editing one child (with click on button with id "edit0")
    const edit0Button = fixture.debugElement.query(By.css('#edit0')).nativeElement;
    expect(edit0Button.title).toEqual('Edit');
    edit0Button.click();
    fixture.detectChanges();

    // The other child is disabled
    const edit1Button = fixture.debugElement.query(By.css('#edit1')).nativeElement;
    expect(edit1Button.disabled).toEqual(true);

    // Change the streetname
    const input0 = fixture.debugElement.query(By.css('#streetname0')).nativeElement;
    expect(input0.readOnly).toBe(false);
    input0.value = 'Bond street';
    input0.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.child1.record['aaa_streetname']).toBeDefined();

    // Save the change
    const save0Button = fixture.debugElement.query(By.css('#save0')).nativeElement;
    save0Button.click();
    fixture.detectChanges();
    tick();

    // The other child is editable
    expect(edit1Button.disabled).toEqual(false);
  }));
});
