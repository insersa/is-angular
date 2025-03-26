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

import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewEncapsulation } from '@angular/core';

import { Tools } from '../../../util/tools';
import { ColumnComponent } from '../column/column.component';
import { RowComponent } from '../row/row.component';

/**
 * Table to show data inspired by PrimeNG DataTable
 * (https://github.com/primefaces/primeng/blob/master/src/app/components/datatable/datatable.ts).
 */
@Component({
  selector: 'is-table',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterContentInit {
  /**
   * An array of objects to display.
   */
  @Input() public value: any[];

  /**
   * Name of the field to sort data by default.
   */
  @Input() public sortField: string;

  /**
   * <code>false</false> to disable the sort function even if a column is marked as sortable.
   */
  @Input() public sortable = true;

  /**
   * Order to sort when default sorting is enabled.
   */
  @Input() public sortOrder: number;

  /**
   * NOT IMPLEMENTED, only for compatibility with the PrimeNG DataTable component.
   */
  @Input() public emptyMessage = 'No records found';

  /**
   * Function that gets the row data and row index as parameters and returns a style class for the row. This is an alternative to the
   * rowStyleMap approach.
   */
  @Input() public rowStyleClass: (row: any, index: number) => string;

  /**
   * Classe(s) à sppliquer sur la ligne de headers, selon format ngClass (string, list our objet)
   */
  @Input() public headerClass: any;

  /**
   * An array of values.
   */
  @Input() public selection: any;

  /**
   * To emit the new selection.
   */
  @Output() public selectionChange: EventEmitter<any> = new EventEmitter();

  /**
   * The children columns to define the table
   */
  @ContentChildren(ColumnComponent) private cols: QueryList<ColumnComponent>;

  /**
   * The children rows to define the additional lines.
   */
  @ContentChildren(RowComponent) private rows: QueryList<RowComponent>;

  /**
   * The column components.
   */
  public columns: ColumnComponent[];

  /**
   * The lines components.
   */
  public lines: RowComponent[];

  ngAfterContentInit(): void {
    this.columns = this.cols.toArray();
    this.lines = this.rows.toArray();
  }

  /**
   * Get the sort order for a column.
   * @param column the column
   * @returns the order
   */
  public getSortOrder(column: ColumnComponent): number {
    if (this.sortField && column.field === this.sortField) {
      return this.sortOrder;
    }

    return 0;
  }

  /**
   * Sort the data.
   */
  public sort(_event: any, column: ColumnComponent) {
    if (column && column.sortable && column.sortable === 'custom') {
      this.sortOrder = this.sortField === column.field ? this.sortOrder * -1 : 1;
      this.sortField = column.field;

      column.sortFunction.emit({
        field: this.sortField,
        order: this.sortOrder,
      });
    }
  }

  /**
   * Get the style class for a row using a function.
   * @param row the row data
   * @param index the row index
   * @returns the stlye class
   */
  public getRowStyleClass(row: any, index: number) {
    if (this.rowStyleClass) {
      return this.rowStyleClass.call(this, row, index);
    }

    return '';
  }

  /**
   * Toggle the global selection checkbox.
   * @param event the event
   */
  public toggleRowsWithCheckbox(event: any): void {
    if (event.target.checked) {
      this.selection = this.value;
    } else {
      this.selection = [];
    }

    this.selectionChange.emit(this.selection);
  }

  /**
   * Toggle a row selection checkbox.
   * @param event the event
   * @param row the row
   */
  public toggleRowWithCheckbox(_event: any, row: any): void {
    const selectionIndex = this.findIndexInSelection(row);
    this.selection = this.selection || [];

    if (selectionIndex !== -1) {
      this.selection = this.selection.filter((_val: any, i: number) => i !== selectionIndex);
      this.selectionChange.emit(this.selection);
    } else {
      this.selection = [...this.selection, row];
      this.selectionChange.emit(this.selection);
    }
  }

  /**
   * Check if all the rows are selected.
   * @returns <code>true</code> if all the rows are selected
   */
  public get allSelected(): boolean {
    let val = true;
    if (this.value && this.selection && this.value.length <= this.selection.length) {
      for (const data of this.value) {
        if (!this.isSelected(data)) {
          val = false;
          break;
        }
      }
    } else {
      val = false;
    }
    return val;
  }

  /**
   * Check if a row is selected.
   * @param row the row
   * @returns <code>true</code> if the row is selected
   */
  public isSelected(row: any): boolean {
    if (row && this.selection) {
      if (this.selection instanceof Array) {
        return this.findIndexInSelection(row) > -1;
      } else {
        return Tools.deepEquals(row, this.selection);
      }
    }

    return false;
  }

  /**
   * Find the index of a row in the row selection.
   * @param row the row
   * @returns the index
   */
  private findIndexInSelection(row: any): number {
    if (this.selection) {
      for (let i = 0; i < this.selection.length; i++) {
        if (Tools.deepEquals(row, this.selection[i])) {
          return i;
        }
      }
    }

    return -1;
  }

  /**
   * Chck if the table is empty.
   * @returns <code>true</code> if the table is empty
   */
  public isEmpty(): boolean {
    return !this.value || this.value.length === 0;
  }
}
