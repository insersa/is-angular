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

import { AfterContentInit, Component, ContentChildren, forwardRef, Input, QueryList, TemplateRef } from '@angular/core';

import { TemplateDirective } from '../../directives/template.directive';

/**
 * Additional row of a table record to add more information.
 */
@Component({
  selector: 'is-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class RowComponent implements AfterContentInit {
  /**
   * Inline style of the column.
   */
  @Input() public style: any;

  /**
   * The templates to render the row.
   */
  @ContentChildren(forwardRef(() => TemplateDirective))
  public templates: QueryList<any>;

  /**
   * The template for the row.
   */
  public template: TemplateRef<any>;

  ngAfterContentInit(): void {
    this.templates.forEach((item: TemplateDirective) => {
      this.template = item.template;
    });
  }
}
