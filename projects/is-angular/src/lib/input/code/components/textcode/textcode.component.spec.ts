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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';

import { getTranslateModule } from '../../../../test';
import { CodeServiceMock } from '../../../../test/code-configuration';
import { CodeService } from '../../services/code.service';
import { CodeComponent } from '../code/code.component';

import { TextcodeComponent } from './textcode.component';

describe('TextcodeComponent', () => {
  let component: TextcodeComponent;
  let fixture: ComponentFixture<TextcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, AutoCompleteModule, getTranslateModule(), RadioButtonModule ],
      declarations: [ TextcodeComponent, CodeComponent ],
      providers: [ {provide: CodeService, useClass: CodeServiceMock} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
