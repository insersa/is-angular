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

import { Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../../../user/services/user.service';

@Component({
  selector: 'is-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextComponent),
    },
  ],
})
export class TextComponent implements ControlValueAccessor, OnInit {
  @Input() textarea = false;
  /** Nombre de caractères minimum */
  @Input() minlength: number;
  @Input() rows = 3;
  /** Valeur minimale pour un nombre */
  @Input() min: number;
  /** Valeur maximale pour un nombre */
  @Input() max: number;
  @Input() decimals: number;
  /** Affichage en mode consultation */
  @Input() readonly: boolean;
  /** Affichage du composant désactivé en mode édition */
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() submitted: boolean;
  /** Inclure erreur "required" dans les messages à afficher au-dessous le composant */
  @Input() messageRequired = true;
  /** Format qui determine s'il faut utiliser un pipe en mode readonly, ex. 'number' */
  @Input() format: string;
  /** Unité à mettre à la fin de la valeur en mode readonly, ex. 168 m2 */
  @Input() unit: string;

  /**
   * A regular expression to validate the input value (don't work on textarea).
   */
  @Input() pattern: string;

  /**
   * The maximum number of characters allowed in the element.
   */
  @Input() maxlength: number;

  /** Flag pour indiquer si le champ est éditable selon le droit de modification du champ (t_dataperm).
   * En mode de recherche par exemple, on ne veut pas appliquer la sécurité.
   * Si un projet n'applique pas des droits sur les champs, ce flag a aucun effet. */
  @Input() security = true;

  /**
   * Clé pour la traduction du placeholder
   */
  @Input() placeholderKey: string;

  /**
   * Classe a mettre sur le composant input
   */
  @Input() inputClass: string;

  /** CLasse à mettre sur le span "unit" (m, km, etc.) */
  @Input() unitClass: string;

  /**
   * Clé de la valeur minimum, permettre de passer en paramètre un message différent de celui prévu
   */
  @Input() validatorMinvalueKey: string;

  /**
   * Clé de la valeur minimum, permettre de passer en paramètre un message différent de celui prévu
   */
  @Input() validatorMaxvalueKey: string;

  @Output() onblur = new EventEmitter();

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

  ngOnInit() {
    this.inputControl = this.injector.get<NgControl>(NgControl);
    if (!this.validatorMinvalueKey) {
      this.validatorMinvalueKey = 'validator.minvalue';
    }
    if (!this.validatorMaxvalueKey) {
      this.validatorMaxvalueKey = 'validator.maxvalue';
    }
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

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // Set touched on blur
  onBlur() {
    this.onTouched();
    this.onblur.emit();
  }
}
