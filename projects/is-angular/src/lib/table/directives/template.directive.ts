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

@Directive({
  selector: '[isTemplate]',
})
export class TemplateDirective {
  /**
   * The type of the template.
   */
  @Input() public type: string;

  /**
   * The name of the directive.
   */
  @Input() isTemplate: string;

  /**
   * Constructor.
   * @param template the template reference
   */
  constructor(public template: TemplateRef<any>) {}

  /**
   * Get the type of the template.
   * @returns the type
   */
  public getType(): string {
    return this.isTemplate;
  }
}
