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

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { CodeService } from '../../services/code.service';
/**
 * Composant pour sélectionner un code dans un champ text libre
 */
@Component({
  selector: 'is-textcode',
  templateUrl: './textcode.component.html',
  styleUrls: ['./textcode.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextcodeComponent),
    },
  ],
})
export class TextcodeComponent implements OnInit, OnDestroy, ControlValueAccessor {
  /* Nom du code */
  @Input() fieldname = '';
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() submitted: boolean;
  @Input() maxlength: number;
  @Input() inputClass: string;
  public suggestions: string[] = [];
  private codeTexts: string[] = [];
  private innerValue: string;
  private langSubscription: Subscription;
  /* Modification de ngModel ou ngControl */
  private onChange: (value: any) => void;

  constructor(private code: CodeService, public translate: TranslateService) {}

  ngOnInit() {
    this.initCodetexts();
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.initCodetexts();
    });
  }

  ngOnDestroy() {
    this.langSubscription.unsubscribe();
  }

  private initCodetexts(): void {
    this.code.getCodes().subscribe((res) => {
      if (!res[this.fieldname]) {
        return;
      }
      this.codeTexts = [];
      const codes = res[this.fieldname];
      for (const code of codes) {
        const label = this.translate.instant(`iscode.${this.fieldname}.${code}`);
        if (label !== undefined) {
          this.codeTexts.push(label);
        }
      }
    });
  }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      let value = v;
      if (value !== undefined && value !== null && value.length === 0) {
        value = undefined;
      }
      this.innerValue = value;
      this.onChange(value);
    }
  }

  search(query: string) {
    if (query.length === 0) {
      this.suggestions = this.codeTexts;
      return;
    }
    const suggestions = [];
    for (const text of this.codeTexts) {
      if (text.indexOf(query) >= 0) {
        suggestions.push(text);
      }
    }
    this.suggestions = suggestions;
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
