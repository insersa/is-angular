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

import { Component } from '@angular/core';

import { QueryBuilderConfig } from '../../../projects/is-angular/src/lib/query-builder/component/query-builder.interfaces';

@Component({
  selector: 'app-query-test',
  templateUrl: './querytest.component.html',
  styleUrls: ['./querytest.component.scss'],
})
export class QuerytestComponent {
  query = {
    condition: 'and',
    rules: [
      { field: 'age', operator: '<=', value: 'Bob' },
      { field: 'gender', operator: '>=', value: 'm' },
    ],
  };

  config: QueryBuilderConfig = {
    fields: {
      age: { name: 'Age', type: 'number', entity: 'physical' },
      gender: {
        name: 'Gender',
        entity: 'physical',
        type: 'category',
        options: [
          { name: 'Male', value: 'm' },
          { name: 'Female', value: 'f' },
        ],
      },
      name: { name: 'Name', type: 'string', entity: 'nonphysical' },
      notes: {
        name: 'Notes',
        type: 'textarea',
        operators: ['=', '!='],
        entity: 'nonphysical',
      },
      educated: {
        name: 'College Degree?',
        type: 'boolean',
        entity: 'nonphysical',
      },
      birthday: {
        name: 'Birthday',
        type: 'date',
        operators: ['=', '<=', '>'],
        defaultValue: () => new Date(),
        entity: 'nonphysical',
      },
      school: {
        name: 'School',
        type: 'string',
        nullable: true,
        entity: 'nonphysical',
      },
      occupation: {
        name: 'Occupation',
        entity: 'nonphysical',
        type: 'category',
        options: [
          { name: 'Student', value: 'student' },
          { name: 'Teacher', value: 'teacher' },
          { name: 'Unemployed', value: 'unemployed' },
          { name: 'Scientist', value: 'scientist' },
        ],
      },
    },
  };
}
