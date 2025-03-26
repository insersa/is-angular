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
 * Pipe pour formater un nombre en mettant des Zéros passé un paramètre (Width) avant le nombre qu'on souhaite formater
 *
 * https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
 * */
@Pipe({
  name: 'isformatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: any, width: number, char?: string): any {
    if (!value) {
      return value;
    }
    char = char || '0';
    let stringValue = String(value);
    stringValue = stringValue + '';
    return stringValue.length >= width ? stringValue : new Array(width - stringValue.length + 1).join(char) + stringValue;
  }
}
