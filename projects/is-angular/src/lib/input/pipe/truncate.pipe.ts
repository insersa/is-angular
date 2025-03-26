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
 * Affiche le nombre de caractères spécifié d'un string. Par défaut 10.
 */
@Pipe({
  name: 'istruncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, args: string): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const limit = args ? parseInt(args, 10) : 10;
    const trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
