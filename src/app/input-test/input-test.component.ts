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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-test',
  templateUrl: './input-test.component.html',
  styleUrls: ['./input-test.component.scss'],
})
export class InputTestComponent implements OnInit {
  public record = {};

  public minDate: Date;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const currTime = new Date();
    this.minDate = new Date(currTime.getFullYear(), currTime.getMonth(), currTime.getDate());
    this.translate.currentLang = 'fr';
  }
}
