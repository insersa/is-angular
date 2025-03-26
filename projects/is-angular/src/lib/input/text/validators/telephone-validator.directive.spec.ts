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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TelephoneValidatorDirective } from './telephone-validator.directive';

@Component({
  selector: 'is-mock-parent',
  template: `<form #form="ngForm" novalidate>
    <input name="phoneNumber" #inputComp="ngModel" [(ngModel)]="phoneNumber" isValidateTelephone>
  </form>
    `
})
export class MockParentComponent {
  phoneNumber;
  @ViewChild('inputComp') inputControl;

  public MockParentComponent() {}
}
describe('TelephoneValidatorDirective', () => {
  let fixture: ComponentFixture<MockParentComponent>;
  let component: MockParentComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MockParentComponent, TelephoneValidatorDirective],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockParentComponent);
    component = fixture.componentInstance;
  });

  it('021 696 22 44 is a valid phone number', () => {
    component.phoneNumber = '021 696 22 44';
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(true);
    });
  });

  it('021.691.22.44 is an invalid phone number', () => {
    component.phoneNumber = '021.691.22.44';
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(false);
    });
  });

  it('021-6912244 is an invalid phone number', () => {
    component.phoneNumber = '021-6912244';
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(false);
    });
  });

});
