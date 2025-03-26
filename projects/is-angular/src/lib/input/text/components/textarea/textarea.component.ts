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

import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../../user/services/user.service';
/**
 * PrimeNG textarea component with autoresize
 */
@Component({
  selector: 'is-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextareaComponent),
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor, OnInit {
  /**
   * The number of rows
   */
  @Input() rows = 3;
  @Input() autoResize = true;
  @Input() maxlength: number;
  @Input() readonly: boolean;
  /** Affichage du composant désactivé en mode édition */
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() submitted: boolean;
  /** Classe a mettre sur le composant input */
  @Input() inputClass: string;
  @Input() security = true;

  /**
   * L'objet NgControl (avec erreurs de validation) associé avec ce composant
   */
  inputControl: NgControl;

  /* Valeur saisie */
  innerValue: string;

  /* Modification de ngModel ou ngControl */
  protected onChange: (value: any) => void;
  protected onTouched: () => void;

  constructor(private injector: Injector, public translate: TranslateService, public user: UserService) {}

  ngOnInit(): void {
    this.inputControl = this.injector.get<NgControl>(NgControl);
  }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    this.innerValue = v;
    this.onChange(v);
  }

  writeValue(value: any): void {
    this.innerValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Set touched on blur
  onBlur(): void {
    this.onTouched();
  }
}
