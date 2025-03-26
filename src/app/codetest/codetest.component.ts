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

interface RecordType {
  [key: string]: string | string[] | boolean | number | undefined;
}

/**
 * Demo des différents types de codes: normale, multi-code, checkbox (checked=1, unchecked=2),
 * text-code (champ text libre avec codes en autocomplete)
 */
@Component({
  selector: 'app-codetest',
  templateUrl: './codetest.component.html',
  styleUrls: ['./codetest.component.scss'],
})
export class CodetestComponent implements OnInit {
  record: RecordType = {};
  keepColor = ['1'];

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.use('en');
  }
}
