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

import { PasswordValidatorDirective } from './password-validator.directive';

/**
 * Mock component that contains a form for chaning the password
 */
@Component( {
  selector: 'is-mock-parent',
  template: `<form #form="ngForm" novalidate>
    <div ngModelGroup="passwords" #passwords="ngModelGroup" isValidatePassword>
      <input name="oldPassword" [(ngModel)]="oldPassword">
      <input name="newPassword" [(ngModel)]="newPassword">
      <input name="confirmPassword" [(ngModel)]="confirmPassword">
    </div>
  </form>
    `
})
export class MockParentComponent {
  oldPassword;
  newPassword;
  confirmPassword;
  @ViewChild('passwords') passwords;

  public MockParentComponent() {}
}

describe('PasswordValidatorDirective', () => {
  let fixture: ComponentFixture<MockParentComponent>;
  let component: MockParentComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MockParentComponent, PasswordValidatorDirective],
      providers: []
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(MockParentComponent);
    component = fixture.componentInstance;
  });

  it('old password should be different from new password, and new password identical to confirm password',
    () => {
      component.oldPassword = 'test1';
      component.newPassword = 'test2';
      component.confirmPassword = 'test2';
      fixture.detectChanges();
      fixture.whenStable().then( () => {
        expect(component.passwords.valid).toBe(true);
      });
    });

  it('old password should not be identical to new password',
    () => {
      component.oldPassword = 'test2';
      component.newPassword = 'test2';
      component.confirmPassword = 'test2';
      fixture.detectChanges();
      fixture.whenStable().then( () => {
        expect(component.passwords.valid).toBe(false);
      });
    });


  it('new password should not be different from confirm password', () => {
    component.oldPassword = 'test1';
    component.newPassword = 'test2';
    component.confirmPassword = 'test3';
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.passwords.valid).toBe(false);
    });
  });
});
