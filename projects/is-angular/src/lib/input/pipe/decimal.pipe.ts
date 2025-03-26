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

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converti les entiers en décimal, ex. 1 -> 1.0
 */
@Pipe({
  name: 'decimal',
})
export class DecimalPipe implements PipeTransform {
  transform(value: any, decimals: number): any {
    if (!value && value !== 0) {
      return value;
    }

    // Transforme uniquement si c'est un number
    const numberpattern = /^-?\d+$/;
    let stringValue = String(value);
    if (!stringValue.match(numberpattern)) {
      return value;
    }
    stringValue = `${stringValue}.`;
    for (let i = 0; i < decimals; i++) {
      stringValue = `${stringValue}0`;
    }
    return stringValue;
  }
}
