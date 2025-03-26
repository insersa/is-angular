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
 * Formate un no de téléphone au format numérique en un string au format
 * "iii nnn nn nn" ou "ii nnn nn nn" où "i" représente l'indicatif.
 * <p>
 * Exemple:<br>
 * 17568811 => "01 756 88 11" (8 car.) 216437711 => "021 643 77 11" (9 car.)
 * 41014256312 => "0041014256312" (11 car.) 410274256312 => "00410274256312"
 * (12 car.) 3905211234567 => "3905211234567" (13 car.)
 * <p>
 * Les numéros long (> 9 car.) non suisses (ne commançant pas par '410' ne
 * sont pas formatés.
 */
@Pipe({
  name: 'telephone',
})
export class TelephonePipe implements PipeTransform {
  transform(value: any): any {
    if (value === undefined) {
      return undefined;
    }
    // Remove whitespaces and prefix zeroes to establish the length
    let str = value.toString().replace(/\s/g, '');
    while (str.startsWith(0)) {
      str = str.substring(1, str.length);
    }
    const length = str.length;

    // Determine prefix length
    let prefixLength = 0;
    switch (length) {
      case 8:
        prefixLength = 1;
        break;
      case 9:
        prefixLength = 2;
        break;
      case 11:
      case 12:
        if (str.startsWith('41')) {
          // Numéro suisse avec indicatif du pays
          return `00${value}`;
        }
        return value;
      default:
        return value;
    }

    // Indicatif
    const indic = `0${str.substring(0, prefixLength)}`;

    // 1ère partie numéro
    const premier = str.substring(prefixLength, prefixLength + 3);

    // 2ème partie numéro
    const deuxieme = str.substring(prefixLength + 3, prefixLength + 5);

    // 3ème partie numéro
    const troisieme = str.substring(prefixLength + 5);

    return `${indic} ${premier} ${deuxieme} ${troisieme}`;
  }

  /**
   * Converts a phone number from string to number
   * @param value string format, ex. 021 691 44 55
   * @returns ex. 0216914455
   */
  parse(value: string) {
    return value.replace(/\s/g, '');
  }
}
