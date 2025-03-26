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
 * Validateur pour inputs de type liste, p.ex. multicodes
 */
@Directive({
  selector: '[isValidateList][ngModel],[isValidateList][formControlName],[isValidateList][formControl]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ListValidatorDirective),
      multi: true,
    },
  ],
})
export class ListValidatorDirective {
  @Input() public required = false;

  constructor() {}

  validate(c: UntypedFormControl): { [key: string]: any } | null {
    if (this.required && (c.value === undefined || c.value === null || c.value.length === 0)) {
      return { required: true };
    }
    return null;
  }
}
