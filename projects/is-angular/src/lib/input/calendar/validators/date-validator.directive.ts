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
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[isValidateDate][ngModel],[isValidateDate][formControlName],[isValidateDate][formControl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateValidatorDirective),
      multi: true,
    },
  ],
})
export class DateValidatorDirective implements Validator {
  @Input() minDate: Date;
  @Input() maxDate: Date;

  constructor() {}

  validate(c: AbstractControl): { [key: string]: any } | null {
    if (!c.value || c.value.length === 0) {
      return null;
    }
    // console.log('ISDateValidator.validate', c.value, type);
    if (typeof c.value === 'object') {
      if (this.minDate && c.value.getTime() < this.minDate.getTime()) {
        console.log('Date before minDate: ', c.value, this.minDate);
        return { minDate: true };
      }
      if (this.maxDate && c.value.getTime() > this.maxDate.getTime()) {
        // console.log('Date after maxDate: ',date, this.maxDate);
        return { maxDate: true };
      }
    }
    return null;
  }
}
