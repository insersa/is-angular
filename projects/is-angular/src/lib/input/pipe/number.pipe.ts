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
 * Pipe pour afficher des nombres dans le format suisse 1'000'000
 */
@Pipe({
  name: 'isnumber',
})
export class NumberPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) {
      return value;
    }

    // Transforme uniquement si c'est un number
    const numberpattern = /^-?\d+$/;
    const decimalpattern = /^-?\d+\.\d+$/;
    const stringValue = String(value);
    if (!stringValue.match(numberpattern) && !stringValue.match(decimalpattern)) {
      return value;
    }
    return Number(value).toLocaleString('de-CH');
  }
}
