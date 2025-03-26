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

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Checkbox } from 'primeng/checkbox';

import { UserService } from '../../../../user/services/user.service';
import { CodeService } from '../../services/code.service';
import { CodeComponent } from '../code/code.component';

/**
 * Component for selecting multiple codes
 *
 * By default displays an empty bar with an arrow (as a select component).
 * When clicked, it opens a popover (popup) with a list of pairs "checkbox, code label"
 *
 * Special features:
 *
 * 1. shortcut codes: displays a horizontal set of pairs "checkbox, code label" that represent ranges of codes,
 * ex. "errors": 110-150. When a shortcut code is clicked, the whole range is selected automatically in the full list of codes
 *
 * 2. showPopup: when set to true true hides the button that opens the popover and displays only the shortcuts
 *
 * 3. shortcutsInline: when set to false, the shortcuts are displayed vertically instead of horizontally
 *
 * 4. Select all/Unselect all: in the popover, all codes can be selected or unselected with a button click
 */
@Component({
  selector: 'is-multicode',
  templateUrl: './multicode.component.html',
  styleUrls: ['./multicode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MulticodeComponent),
    },
  ],
})
export class MulticodeComponent extends CodeComponent {
  /* Nom du code */
  @Input() fieldname = '';
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() submitted: boolean;
  @Input() inputClass: string;
  @Input() disabled: boolean;

  /**
   * Liste de codes "shortcut" à afficher sur une ligne horizontal pour sélectionner dans un seul coup une range de codes
   * Pour chaque shortcut code: {from: <mincode>, to: <maxcode>, labelKey: <clé pour la traduction>}
   */
  @Input() shortcutCodes: any = [];

  /**
   * Lister les codes "shortcut" sur une ligne
   */
  @Input() shortcutsInline = true;

  /** Flag pour afficher toute la liste de codes */
  @Input() showPopup = true;

  /** Flag pour indiquer si le champ est éditable selon le droit de modification du champ (t_dataperm).
   * En mode de recherche par exemple, on ne veut pas appliquer la sécurité.
   * Si un projet n'applique pas des droits sur les champs, ce flag a aucun effet. */
  @Input() security = true;

  @Output() selectShortcut = new EventEmitter<any>();

  /**
   * List of all checkbox controls of this component
   */
  @ViewChildren(Checkbox) controls: QueryList<Checkbox>;

  /**
   * Codes shortcut sélectionnés
   */
  public shortcutValues: any = [];

  /** Codes sélectionnés */
  public selectedValues: any = [];

  constructor(
    codeService: CodeService,
    logger: NGXLogger,
    translate: TranslateService,
    cdr: ChangeDetectorRef,
    injector: Injector,
    user: UserService
  ) {
    super(codeService, logger, translate, injector, user, cdr);
  }

  /**
   * Sélection d'un code dans la liste de codes
   */
  onSelect() {
    this.clearShortcutCodes();
    this.onChange(this.selectedValues);
  }

  /**
   * Sélection d'un code "shortcut"
   */
  onSelectShortcut(shortcutCode: any) {
    const from = shortcutCode['from'];
    const to = shortcutCode['to'];
    const checked = shortcutCode['checked'];

    for (const code of this.codes) {
      // Rafraichi les valeurs sélectionnées
      if (+code === +from || (to && +code > from && +code <= to)) {
        this.modifySelectedValues(this.selectedValues, code, checked);
      }
    }

    // Rafraichi les coches
    this.controls.forEach((control: Checkbox) => {
      if (
        !(control.inputId && control.inputId.startsWith('shortcut')) &&
        (+control.value === from || (to && +control.value > from && +control.value <= to))
      ) {
        control.checked = checked;
      }
    });
    this.onChange(this.selectedValues);
    this.selectShortcut.emit({
      from: from,
      to: to,
      checked: checked,
      allCheckedValues: this.selectedValues,
    });
  }

  /**
   * Add or remove a value from the array
   * @param list array of values
   * @param value value to add or remove
   * @param checked when true value should be added, otherwise removed
   */
  private modifySelectedValues(list: any[], value: any, checked: boolean) {
    const idx = list.indexOf(value);
    if (checked && idx < 0) {
      list.push(value);
    } else if (!checked && idx >= 0) {
      list.splice(idx, 1);
    }
  }

  /**
   * Sélection ou déselection de tous les codes
   */
  onSelectAll(select: boolean) {
    this.clearShortcutCodes();

    // Check checkboxes manually
    this.controls.forEach((control: Checkbox) => {
      if (!control.inputId || !control.inputId.startsWith('shortcut')) {
        control.trueValue = select;
      }
    });
    // Update list
    this.selectedValues = [];
    if (select) {
      for (const code of this.codes) {
        this.selectedValues.push(code);
      }
    }
    this.onChange(this.selectedValues);
  }

  /**
   * Ecrit la liste de codes par value accessor ngModel
   */
  writeValue(value: any) {
    this.clearShortcutCodes();
    this.shortcutValues = [];
    if (value !== undefined && value !== null && value.length > 0) {
      this.selectedValues = value;
      for (const item of this.selectedValues) {
        this.checkShortcut(+item, +item);
      }
    }
  }

  /**
   * Décoche les shortcuts
   */
  private clearShortcutCodes() {
    if (this.controls === undefined) {
      return;
    }
    this.controls.forEach((control: Checkbox) => {
      if (control.inputId && control.inputId.startsWith('shortcut')) {
        control.trueValue = false;
        this.shortcutValues = this.shortcutValues.map(String);
        this.modifySelectedValues(this.shortcutValues, String(control.value), false);
      }
    });
  }

  /**
   * Coche le "shortcut" qui correspond au range donné
   * @param from code min
   * @param to code max
   */
  private checkShortcut(from: number, to: number) {
    const checkIds: string[] = [];
    for (const shortcut of this.shortcutCodes) {
      if (shortcut.from === from && shortcut.to === to) {
        checkIds.push('shortcut' + from);
        this.shortcutValues.push(-from);
      }
    }
    this.controls.forEach((control: Checkbox) => {
      if (control.inputId && checkIds.indexOf(control.inputId) >= 0) {
        control.trueValue = true;
      }
    });
  }
}
