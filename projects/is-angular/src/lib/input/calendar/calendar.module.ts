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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule as CalendarModulePrimeNG } from 'primeng/calendar';

import { PipeModule } from '../pipe/pipe.module';
import { TextModule } from '../text/text.module';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateValidatorDirective } from './validators/date-validator.directive';

@NgModule({
  declarations: [CalendarComponent, DateValidatorDirective],
  imports: [CommonModule, FormsModule, TranslateModule, CalendarModulePrimeNG, TextModule, PipeModule],
  exports: [CalendarComponent, DateValidatorDirective],
})
export class CalendarModule {}
