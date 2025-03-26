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

import { Component, OnInit } from '@angular/core';

import { ObjectService } from '../../../projects/is-angular/src/lib/object/services/object.service';

@Component({
  selector: 'app-data-test',
  templateUrl: './data-test.component.html',
  styleUrls: ['./data-test.component.scss'],
})
export class DataTestComponent implements OnInit {
  public list: unknown[] = [];

  constructor(private object: ObjectService) {}

  ngOnInit() {
    this.object.getList('canton').subscribe((res) => {
      this.list = res['records'];
    });
  }

  onSort(event: unknown) {
    console.log('Sort event', event);
  }
}
