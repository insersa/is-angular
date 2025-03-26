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
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { AutoComplete } from 'primeng/autocomplete';

import { ValueObject } from '../../../../models/interfaces/object.interface';
import { ObjectService } from '../../../../object/services/object.service';
import { UserService } from '../../../../user/services/user.service';

/**
 * Elément séletionné
 */
export class SelectItem {
  /** Id de l'objet retourné au composant parent quand un élément a été sélectionné */
  id: any;

  /** L'enregistrement complet mis à disposition pour exploitation par le composant parent après une sélection */
  record: ValueObject | undefined;
  /* Préfixe d'un élément */
  prefix: string;

  /* Libellé numérique d'un élément */
  number: any;

  /* Libellé textuel de l'élément */
  text: string;

  /* Libellé complémentaire (numérique ou textuel) entre n° et libellé principal */
  middleText: string;

  /* Libellé affiché après sélection */
  combinedLabel: string;

  constructor(
    record: ValueObject,
    idField: string,
    prefixField: string,
    numberField: string,
    textField: string,
    middleField: string,
    selectedField: string,
    combineLabel: boolean
  ) {
    this.record = record;
    this.id = record[idField];
    this.text = record[textField] as string;
    this.combinedLabel = selectedField !== undefined ? String(record[selectedField]) : '';

    this.number = record[numberField];
    if (numberField !== undefined && this.number !== undefined && combineLabel == true) {
      this.prefix = prefixField ? String(record[prefixField]) : '';
      this.combinedLabel = this.prefix && this.prefix.trim() !== '' ? `${this.prefix}-${this.number}` : `${this.number}`;
    }

    this.middleText = record[middleField] as string;
    if (middleField !== undefined && this.middleText !== undefined && combineLabel == true) {
      this.combinedLabel += ` ${this.middleText}`;
    }
    this.combinedLabel += ` ${this.text}`;
  }
}

@Component({
  selector: 'is-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements OnInit, ControlValueAccessor {
  @ViewChild('autocomplete') autocomplete: AutoComplete;

  @Input() idField: string;
  /** Préfixe du libellé*/
  @Input() prefixField: string;
  /** Attribut numérique de type String du libellé */
  @Input() numberField: string;
  /** Attribut textuelle du libellé*/
  @Input() textField: string;
  /** Nom de l'objet métier */
  @Input() objectName: string;
  /** Attribut de la longueur minimum pour effectuer une recherche, par défaut, c'est 0 */
  @Input() minLength = 0;
  /** Attribut supplémentaire à mettre dans le libellé (après le numérique, avant le text) */
  @Input() middleField: string;
  /** Champ à afficher pour valeur sélectionnée si différent de "numberField + textField" */
  @Input() selectedField: string;
  /** Critères de recherche pour filtrer le résultat */
  @Input() filter: any = {};
  @Input() prefix: string;
  /** Clé pour la traduction de placeholder */
  @Input() placeholderKey: string;
  @Input() required: boolean;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() submitted: boolean;
  /** Flag pour remplir automatiquement le suggestion s'il y en a qu'un résultat */
  @Input() withBlur = true;
  /** Flag pour afficher message "Champ obligatoire" sous le composant autocomplete */
  @Input() messageRequired: boolean;
  /** Afficher libellé avec combinaison des l'attributs numéro et text */
  @Input() combinedLabel = true;
  /** Flag pour indiquer si le champ est éditable selon le droit de modification du champ (t_dataperm).
   * En mode de recherche par exemple, on ne veut pas appliquer la sécurité.
   * Si un projet n'applique pas des droits sur les champs, ce flag a aucun effet. */
  @Input() security = true;
  /** Classe pour le composant input*/
  @Input() inputClass = '';
  /** Dans le cas ou le résultat de l'autocomplete devra récupérer un array */
  @Input() isResArray = false;
  /** Option d'afficher la valeur comme un lien <a> en mode lecture-seule. Dans ce cas, écouter le output navigate */
  @Input() withLink: boolean;
  /** Propriété pour définir le mode de recherche (LIKE ou FULLLIKE)*/
  @Input() searchModeNumber: 'LIKE' | 'FULL_LIKE' = 'LIKE';
  /** Message for empty message for autocomplete */
  @Input() emptyMessageKey: string = 'code.empty';

  /** L'enregistrement sélectionné. A utiliser pour afficher des attributs supplémentaires de l'objet par exemple */
  @Output() record = new EventEmitter<ValueObject | undefined>();
  /** Naviguer vers le détail de l'objet métier sélectionné */
  @Output() navigate = new EventEmitter();

  /**
   * Elément sélectionné
   */
  item: SelectItem | undefined;

  /**
   * Liste d'éléments dans le autocomplete
   */
  list: SelectItem[];

  /* L'id de l'objet sélectionné */
  value: any;

  /**
   * L'objet NgControl (avec erreurs de validation) associé avec ce composant
   */
  inputControl: NgControl;

  onChange: (_: any) => void;
  onTouched: (_: any) => void;

  constructor(
    protected objectService: ObjectService,
    public translate: TranslateService,
    protected injector: Injector,
    protected cdr: ChangeDetectorRef,
    protected logger: NGXLogger,
    public user: UserService
  ) {}

  ngOnInit() {
    if (this.idField === undefined) {
      this.idField = this.numberField;
    }
    this.inputControl = this.injector.get<NgControl>(NgControl);
  }

  writeValue(value: any): void {
    this.value = value;
    this.initSelectedItem();
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  search(event: any) {
    const query: any = {};
    const searchKey = this.searchModeNumber;
    if (event.query.match(/^\d+(\.\d*)?$/) && this.numberField !== undefined) {
      query[this.numberField] = { [searchKey]: `${event.query}` };
    } else {
      query[this.textField] = { UPPER_LIKE: `%${event.query}%` };
    }
    if (this.filter !== undefined) {
      for (const field of Object.keys(this.filter)) {
        if (this.filter[field] === undefined) {
          continue;
        }
        if (['string', 'boolean', 'number'].indexOf(typeof this.filter[field]) >= 0) {
          query[field] = this.filter[field];
        } else {
          for (const key of Object.keys(this.filter[field])) {
            if (query[field] === undefined) {
              query[field] = this.filter[field];
            } else {
              query[field][key] = this.filter[field][key];
            }
          }
        }
      }
    }
    // https://www.primefaces.org/primeng-4-0-0-rc4-released/
    // you need to create a new array instead of push to an existing array which does not trigger change detection.
    const newlist: any = [];
    this.objectService.getList(this.objectName, query).subscribe(
      (res: any) => {
        this.logger.debug('AutocompleteComponent.search. Res: ', res);
        for (const record of res.records) {
          const item = new SelectItem(
            record,
            this.idField,
            this.prefixField,
            this.numberField,
            this.textField,
            this.middleField,
            this.selectedField,
            this.combinedLabel
          );
          newlist.push(item);
        }
        this.list = newlist;
      },
      (err: any) => {
        // on error
        this.logger.error('Erreur de recherche', err);
      },
      () => {
        //
      }
    );
  }

  onSelect(event: any) {
    if (event.value.id !== this.value) {
      this.value = event.value.id;
      this.onChange(this.value);
      this.record.emit(this.item ? this.item.record : {});
    }
  }

  onBlur(event: any) {
    if (this.withBlur) {
      this.logger.debug('Autocomplete.onBlur', event);
      if (this.list === undefined) {
        return;
      }
      if (this.list.length === 1 && this.item !== this.list[0]) {
        this.autocomplete.value = this.list[0];
        this.autocomplete.writeValue(this.list[0].combinedLabel);
        this.autocomplete.onModelChange(this.list[0]);
        this.value = (<SelectItem>this.list[0]).id;
        this.cdr.detectChanges();
        this.onChange(this.value);
        this.record.emit(this.item ? this.item.record : undefined);
      }
    }
  }

  protected initSelectedItem() {
    if (this.item !== undefined && this.item !== null && this.item.id === this.value) {
      return;
    }

    if (this.value === undefined || this.value === null) {
      if (this.autocomplete !== undefined) {
        this.autocomplete.value = null;
        this.autocomplete.writeValue('');
        this.autocomplete.onModelChange(null);
      }
      this.item = undefined;
      this.record.emit({});
      return;
    }
    // test si value est un array contenant des id
    if (this.isResArray && typeof this.value === 'object') {
      if (this.value['IN'].length > 1) {
        const manualLine = { record: { id: 0, text: '*' } };
        // On enregistre temporairement idField et textField pour faire une nouvelle recherche après
        const tmpIdField = this.idField;
        const tmpTextField = this.textField;
        this.idField = 'id';
        this.textField = 'text';
        this.putDataInTheField(manualLine, false);
        this.idField = tmpIdField;
        this.textField = tmpTextField;
        return;
      } else {
        this.value = this.value['IN'][0];
      }
    }

    this.objectService.getRecord(this.value, this.objectName, false).subscribe((res: any) => {
      if (!res['record']) {
        this.logger.debug(
          'Autocomplemete.initSelectedItem getRecord status',
          res['status'],
          'Record not initialised',
          this.objectName,
          this.idField,
          this.value
        );
        return;
      }
      this.putDataInTheField(res, true);
      this.record.emit(res.record);
    });
  }

  /**
   * Ajouter les données dans le champs autocomplete
   */
  protected putDataInTheField(res: any, isChanging: boolean) {
    const selected = new SelectItem(
      res.record,
      this.idField,
      this.prefixField,
      this.numberField,
      this.textField,
      this.middleField,
      this.selectedField,
      this.combinedLabel
    );
    if (!this.readonly) {
      // Cette partie ne suffit pas pour afficher la valeur dans le composant <p-autocomplete>
      this.item = selected;

      // Donc modifier la propriété de l'objet autocomplete directement et relancer un check du view
      this.autocomplete.value = selected;
      this.autocomplete.writeValue(selected.combinedLabel);
      if (isChanging) {
        this.autocomplete.onModelChange(selected);
        this.cdr.detectChanges();
      }
    } else {
      this.item = selected;
    }
  }

  onClear() {
    this.item = undefined;
    this.value = undefined;
    this.autocomplete.value = null;
    this.autocomplete.writeValue('');
    this.cdr.detectChanges();
    this.list = [];
    this.onChange(this.value);
    return;
  }
}
