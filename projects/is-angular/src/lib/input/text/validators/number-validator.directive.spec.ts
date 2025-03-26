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

import { getTranslateModule, getUserServiceStubProvider } from '../../../test';
import { PipeModule } from '../../pipe/pipe.module';
import { TextComponent } from '../components/text/text.component';

import { NumberValidatorDirective } from './number-validator.directive';

/**
 * Mock component that contains a number field
 */
@Component({
  selector: 'is-mock-parent',
  template: `<form #form="ngForm" novalidate>
    <is-text name="value" #inputComp="ngModel" [(ngModel)]="value" isValidateNumber [decimals]="decimals"></is-text>
  </form>
    `
})
export class MockParentComponent {
  value;
  decimals = undefined;
  @ViewChild('inputComp') inputControl;

  public MockParentComponent() {}
}

describe('NumberValidatorDirective', () => {
  let fixture: ComponentFixture<MockParentComponent>;
  let component: MockParentComponent;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule, getTranslateModule(), PipeModule],
      declarations: [MockParentComponent, TextComponent, NumberValidatorDirective],
      providers: [getUserServiceStubProvider()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockParentComponent);
    component = fixture.componentInstance;
  });


  it('input 123 is valid', () => {
    component.value = 123;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(true);
    });
  });

  it('input 123.25 is valid', () => {
    component.decimals = 2;
    component.value = 123.25;
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(true);
    });
  });

  it('input ABC is invalid', () => {
    component.value = 'ABC';
    fixture.detectChanges();
    fixture.whenStable().then( () => {
      expect(component.inputControl.valid).toBe(false);
    });

  });
});
