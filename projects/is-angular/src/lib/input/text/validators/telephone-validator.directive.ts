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

import { Directive, forwardRef } from '@angular/core';
import { UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
/**
 * Validates that a string is of telephone format: by default only numbers and spaces are permitted
 *
 * If other formats are needed, this validator can be extended with an optional parameter indicating the format
 */
@Directive({
  selector: '[isValidateTelephone][ngModel],[isValidateTelephone][formControlName],[isValidateTelephone][formControl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TelephoneValidatorDirective),
      multi: true,
    },
  ],
})
export class TelephoneValidatorDirective {
  validate(c: UntypedFormControl): { [key: string]: any } | null {
    if (c.value === undefined || c.value === null || c.value.length === 0) {
      return null;
    }
    // The (?=.*\d) asserts that there is at least one digit in the input.
    // Otherwise, an input with only blank spaces can match
    const numberpattern = /^(?=.*\d)[\d ]+$/;

    const stringValue = c.value.toString();
    if (!stringValue.match(numberpattern)) {
      return { numberFormat: true };
    }
    return null;
  }
}
