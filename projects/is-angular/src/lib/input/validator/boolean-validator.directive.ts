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
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

/**
 * Validation d'une valeure booléenne pour une checkbox obligatoire
 */
@Directive({
  selector: '[isBooleanValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BooleanValidatorDirective),
      multi: true,
    },
  ],
})
export class BooleanValidatorDirective {
  constructor() {}

  validate(c: AbstractControl): { [key: string]: any } | null {
    if (c.value === undefined || c.value === null || c.value === false) {
      return { validateBoolean: true };
    }
    return null;
  }
}
