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

import { Directive, forwardRef, Input } from '@angular/core';
import { UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
/**
 * Validates that the input in a text component is a number
 *
 * For input parameter "decimals", validates that the input has less or equal number of decimals as specified
 *
 * For input parameters "min" and "max" validates that the number is in that range
 */
@Directive({
  selector: '[isValidateNumber][ngModel],[isValidateNumber][formControlName],[isValidateNumber][formControl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberValidatorDirective),
      multi: true,
    },
  ],
})
export class NumberValidatorDirective {
  @Input() public min: number;
  @Input() public max: number;
  @Input() public decimals: number;
  @Input() public pattern: string;

  constructor() {}

  validate(c: UntypedFormControl): { [key: string]: any } | null {
    if (c.value === undefined || c.value === null || c.value.length === 0) {
      return null;
    }
    const numberpattern = /^-?\d+$/;
    let decimalpattern = /^-?\d+\.\d$/;
    if (this.decimals === 2) {
      decimalpattern = /^\d+\.\d{1,2}$/;
    }
    if (this.decimals === 3) {
      decimalpattern = /^\d+\.\d{1,3}$/;
    }
    if (this.pattern) {
      decimalpattern = new RegExp(this.pattern);
    }

    const stringValue = c.value.toString();
    if (this.decimals === undefined && !stringValue.match(numberpattern)) {
      return { numberFormat: true };
    }
    if (this.decimals !== undefined && !stringValue.match(numberpattern) && !stringValue.match(decimalpattern)) {
      return { numberFormat: true };
    }

    const numberValue = Number(c.value);
    if (this.min !== undefined && numberValue < this.min) {
      return { minValue: true };
    }
    if (this.max !== undefined && numberValue > this.max) {
      return { maxValue: true };
    }
    return null;
  }
}
