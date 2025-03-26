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

import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

/**
 * Code comme checkbox: 0=unchecked, 1=checked
 */
@Component({
  selector: 'is-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent),
    },
  ],
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  /** Libellé affiché à droit du checkbox (optionnel) */
  @Input() labelKey: string;

  /** Composant désactivé*/
  @Input() disabled = false;

  /* Modification de ngModel ou ngControl */
  protected onChange: (value: any) => void;

  /** Valeur code */
  private innerValue: number;

  /** Valeur boolean */
  private checked = false;

  constructor(protected logger: NGXLogger, public translate: TranslateService) {}

  ngOnInit() {}

  // get accessor
  get value(): any {
    return this.checked;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.checked) {
      this.checked = v;
      if (v) {
        this.innerValue = 1;
      } else {
        this.innerValue = 0;
      }
      this.onChange(this.innerValue);
    }
  }

  writeValue(value: any) {
    this.innerValue = value;
    this.checked = this.innerValue === 1;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
