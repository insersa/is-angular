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

import { TemplateRef } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';

import { TemplateDirective } from './template.directive';

describe('TemplateDirective', () => {
  beforeEach(async(() => {
    const imports = [];

    const providers = [];
    providers.push(TemplateRef);

    TestBed.configureTestingModule({
      imports: imports,
      declarations: [ ],
      providers: providers
    })
      .compileComponents();
  }));

  it('should create an instance', inject([TemplateRef], (template: TemplateRef<any>) => {
    const directive = new TemplateDirective(template);
    expect(directive).toBeTruthy();
  }));
});
