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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DatePipe } from './date.pipe';
import { DecimalPipe } from './decimal.pipe';
import { FormatNumberPipe } from './format-number.pipe';
import { NumberPipe } from './number.pipe';
import { TelephonePipe } from './telephone.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [DatePipe, NumberPipe, TelephonePipe, TruncatePipe, FormatNumberPipe, DecimalPipe],
  imports: [CommonModule],
  exports: [DatePipe, NumberPipe, TelephonePipe, TruncatePipe, FormatNumberPipe, DecimalPipe],
})
export class PipeModule {}
