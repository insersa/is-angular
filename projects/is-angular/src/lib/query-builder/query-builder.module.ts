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

import { QueryBuilderComponent } from './component/query-builder.component';
import { QueryArrowIconDirective } from './directives/query-arrow-icon.directive';
import { QueryButtonGroupDirective } from './directives/query-button-group.directive';
import { QueryEmptyWarningDirective } from './directives/query-empty-warning.directive';
import { QueryEntityDirective } from './directives/query-entity.directive';
import { QueryFieldDirective } from './directives/query-field.directive';
import { QueryInputDirective } from './directives/query-input.directive';
import { QueryOperatorDirective } from './directives/query-operator.directive';
import { QueryRemoveButtonDirective } from './directives/query-remove-button.directive';
import { QuerySwitchGroupDirective } from './directives/query-switch-group.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    QueryBuilderComponent,
    QueryButtonGroupDirective,
    QueryEntityDirective,
    QueryFieldDirective,
    QueryInputDirective,
    QueryOperatorDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective,
  ],
  exports: [
    QueryBuilderComponent,
    QueryButtonGroupDirective,
    QueryEntityDirective,
    QueryFieldDirective,
    QueryInputDirective,
    QueryOperatorDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective,
  ],
})
export class QueryBuilderModule {}
