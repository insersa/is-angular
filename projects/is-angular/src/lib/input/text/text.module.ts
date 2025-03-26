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
import { InputTextareaModule } from 'primeng/inputtextarea';

import { PipeModule } from '../pipe/pipe.module';

import { TextComponent } from './components/text/text.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { NumberValidatorDirective } from './validators/number-validator.directive';
import { TelephoneValidatorDirective } from './validators/telephone-validator.directive';

@NgModule({
  declarations: [TextComponent, TelephoneValidatorDirective, NumberValidatorDirective, TextareaComponent],
  imports: [CommonModule, FormsModule, TranslateModule, PipeModule, InputTextareaModule],
  exports: [TextComponent, TextareaComponent, TelephoneValidatorDirective, NumberValidatorDirective],
})
export class TextModule {}
