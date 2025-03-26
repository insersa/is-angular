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

import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { TemplateDirective } from '../../directives/template.directive';

/**
 * Column of a table inspired by PrimeNG DataTable
 * (https://github.com/primefaces/primeng/blob/master/src/app/components/common/shared.ts).
 */
@Component({
  selector: 'is-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent implements AfterContentInit {
  /**
   * Property of the row data for the column.
   */
  @Input() public field: string;

  /**
   * THeader text of the column.
   */
  @Input() public header: string;

  /**
   * <code>customize</code> if the column is sortable, for PrimeNG DataTable compatibility. The others values are not supported.
   */
  @Input() public sortable: any;

  /**
   * Inline style of the column.
   */
  @Input() public style: any;

  /**
   *<code>multiple</code> to defines column based selection mode. The others values are not supported.
   */
  @Input() public selectionMode: string;

  /**
   * Sort function for custom sorting.
   */
  @Output() public sortFunction = new EventEmitter<any>();

  /**
   * The template to render the column.
   * ForwardRef allows to refer to references which are not yet defined.
   * Needed for tests to run correctly.
   */
  @ContentChildren(forwardRef(() => TemplateDirective))
  public templates: QueryList<any>;

  /**
   * The template for the header.
   */
  public headerTemplate: TemplateRef<any>;

  /**
   * The template for the body.
   */
  public bodyTemplate: TemplateRef<any>;

  ngAfterContentInit(): void {
    this.templates.forEach((item: TemplateDirective) => {
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = item.template;
          break;
        case 'body':
          this.bodyTemplate = item.template;
          break;
        case 'footer':
        case 'filter':
        case 'editor':
          throw new Error(`Not supported template type: ${item.getType()}`);
        default:
          this.bodyTemplate = item.template;
          break;
      }
    });
  }
}
