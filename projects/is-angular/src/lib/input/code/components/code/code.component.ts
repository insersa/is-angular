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

import { ChangeDetectorRef, Component, forwardRef, Injector, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';

import { Code, CodesList } from '../../../../models/interfaces/code.interface';
import { UserService } from '../../../../user/services/user.service';
import { CodeService } from '../../services/code.service';

@Component({
  selector: 'is-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CodeComponent),
    },
  ],
})
export class CodeComponent implements OnInit, ControlValueAccessor, OnChanges {
  /* Nom du code */
  @Input() fieldname = '';
  /** Affichage en mode consultation */
  @Input() readonly: boolean;
  /** Affichage de composant désactivé en mode édition */
  @Input() disabled: boolean;
  @Input() required = false;
  @Input() submitted: boolean;
  /** Flag pour afficher message d'erreur "required" */
  @Input() messageRequired: boolean;
  /**
   * Flag pour aligner les codes comme des radios horizontales
   */
  @Input() radio: boolean;

  /**
   * <code>true</code> to show each radio button on a different div
   */
  @Input() radioDiv: boolean;

  /** Afficher uniquement le text court, même en mode consult */
  @Input() short = false;

  /** Flag pour indiquer si le champ est éditable selon le droit de modification du champ (t_dataperm).
   * Si un projet n'applique pas des droits sur les champs, ce flag a aucun effet */
  @Input() security = true;
  /** Classe pour le composant input */
  @Input() inputClass: string;
  /** Saisir le code numérique pour filtrer la liste */
  @Input() autocomplete = false;
  /** Codes à exclure de la liste */
  @Input() skip: string[] = [];
  /** Codes à inclure  uniquementdans la liste */
  @Input() keep: string[] = [];

  /**
   * <code>true</code> to show the value on readonly mode.
   */
  @Input() showValue = true;
  /** Message for empty message for autocomplete */
  @Input() emptyMessageKey: string = 'code.empty';
  /** Button to clear field for autocomplete */
  @Input() showClearBtn = false;

  /** Le composant autocomplete primeng*/
  @ViewChild('autocomplete') autocompleteComp: any;

  /* Code sélectionné */
  protected codeValue: number | string | undefined;

  /*Liste de valeurs pour le code */
  public codes: string[] | number[] = [];

  /** Objet sélectionnée dans le autocomplete */
  autocompleteValue: Code | undefined;

  /** Les codes correspondant à la requête autocomplete */
  public codeSuggestions: Code[] = [];

  /** Instance du NgControl de ce composant */
  public inputControl: NgControl;

  /* Modification de ngModel ou ngControl */
  protected onChange: (value: string | number | undefined) => void;

  /** Tableau des codes originaux */
  private originalCodes: string[] | number[];

  constructor(
    protected codeService: CodeService,
    protected logger: NGXLogger,
    public translate: TranslateService,
    protected injector: Injector,
    public user: UserService,
    protected cdf: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initCodes();
    this.inputControl = this.injector.get<NgControl>(NgControl);
    this.translate.onLangChange.subscribe(() => {
      this.initAutocomplete();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.skip) {
      // Shorten the code list
      this.skipCodes();
    }
    if (changes.keep) {
      // Shorten the code list
      this.keepCodes();
    }
  }

  /** Recreate the code list with only the values that are in the keep list */
  protected keepCodes() {
    if (!this.codes || this.keep.length === 0) {
      return;
    }
    const codes = [];
    for (const value of this.originalCodes) {
      if (this.keep.indexOf(value.toString()) >= 0) {
        codes.push(value);
      }
    }
    this.codes = codes as string[] | number[];
  }
  /** Recreate the code list with only the values that are not in the skip list */
  protected skipCodes() {
    if (!this.codes || this.skip.length === 0) {
      return;
    }
    const codes = [];
    for (const value of this.codes) {
      if (this.skip.indexOf(value.toString()) < 0) {
        if (typeof value === 'string') {
          codes.push(value as string);
        } else {
          codes.push(value as number);
        }
      }
    }
    this.codes = codes as string[] | number[];
  }

  protected initCodes() {
    this.codeService.getCodes().subscribe((res: CodesList) => {
      this.codes = res[this.fieldname];
      this.originalCodes = res[this.fieldname];
      this.skipCodes();
      this.keepCodes();
    });
  }

  /**
   * Initialise la valeur du code dans l'autocomplete
   */
  protected initAutocomplete() {
    if (!this.autocomplete) {
      return;
    }
    this.autocompleteValue = this.codeValue
      ? {
          code: this.codeValue,
          name: this.translate.instant(`iscode.${this.fieldname}.${this.codeValue}`) + ` ${this.codeValue}`,
        }
      : undefined;
  }

  // get accessor
  get value(): string | number | undefined {
    return this.codeValue;
  }

  // set accessor including call the onchange callback
  set value(v: string | number | undefined) {
    if (v !== this.codeValue) {
      let value = v;
      if (value !== undefined && value !== null && typeof value === 'string' && value.length === 0) {
        value = undefined;
      }
      this.codeValue = value;
      this.onChange(value);
    }
  }

  writeValue(value: string | number | undefined) {
    this.codeValue = value;
    this.initAutocomplete();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched() {}

  /**
   * Evénement de autocomplete
   */
  onSuggest(event: any) {
    this.codeSuggestions = [];
    for (let i = 0; i < this.codes.length; i++) {
      const code = this.codes[i];
      const label = this.translate.instant(`iscode.${this.fieldname}.${code}`);
      const query = event.query ? event.query : '';
      if (query.length === 0 || code.toString().indexOf(query) === 0 || label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.codeSuggestions.push({ code: code, name: `${label} ${code}` });
      }
    }
  }

  onBlur(event: any) {
    this.logger.debug('Code.onBlur', event);
    if (this.codeSuggestions.length === 0) {
      return;
    }
    if (this.codeSuggestions.length === 1 && this.autocompleteValue !== this.codeSuggestions[0]) {
      this.autocompleteComp.value = this.codeSuggestions[0];
      this.autocompleteComp.inputFieldValue = this.codeSuggestions[0].name;
      this.autocompleteComp.onModelChange(this.codeSuggestions[0]);
      this.codeValue = this.codeSuggestions[0].code;
      this.cdf.detectChanges();
      this.onChange(this.codeValue);
    }
  }

  get objectValue(): Code | undefined {
    return this.autocompleteValue;
  }

  set objectValue(value: Code | undefined) {
    if (value) {
      this.autocompleteValue = value;
      this.codeValue = value.code;
    } else {
      this.autocompleteValue = undefined;
      this.codeValue = undefined;
    }
    this.onChange(this.codeValue);
  }

  /**
   * Callback to invoke when clear button is clicked
   */
  clearSuggestion() {
    this.logger.debug('Code.clearSuggestion');
    this.autocompleteValue = undefined;
  }
}
