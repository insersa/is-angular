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
import { format } from 'date-fns';

/**
 * Workaround from https://github.com/jvandemo/generator-angular2-library/issues/221#issuecomment-355945207
 */

/**
 * Workaround pour problème: Angular2 date pipe does not work in IE 11 and edge 13/14
 * http://stackoverflow.com/questions/39728481/angular2-date-pipe-does-not-work-in-ie-11-and-edge-13-14
 * https://angular.io/docs/ts/latest/guide/pipes.html
 * http://momentjs.com/docs/#/parsing/string/
 *
 * Moment est une librairie trop lourde. On essaie avec date-fns MA 10.09.2020
 */
@Pipe({
  name: 'isdate',
})
export class DatePipe implements PipeTransform {
  transform(value: string, inputformat = ''): string {
    if (!value || value === '') {
      return '';
    }
    return format(new Date(value), inputformat);
  }
}
