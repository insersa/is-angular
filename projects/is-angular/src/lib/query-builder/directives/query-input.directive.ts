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

import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[isQueryInput]' })
export class QueryInputDirective {
  /** Unique name for query input type. */
  @Input()
  get queryInputType(): string {
    return this._type;
  }
  set queryInputType(value: string) {
    // If the directive is set without a type (updated programatically), then this setter will
    // trigger with an empty string and should not overwrite the programatically set value.
    if (!value) {
      return;
    }
    this._type = value;
  }
  private _type: string;

  constructor(public template: TemplateRef<any>) {}
}
