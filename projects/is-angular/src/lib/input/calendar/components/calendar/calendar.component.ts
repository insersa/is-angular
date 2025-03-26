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

import { Component, forwardRef, Injector, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';

import { UserService } from '../../../../user/services/user.service';

@Component({
  selector: 'is-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalendarComponent),
    },
  ],
})
export class CalendarComponent implements OnInit, OnDestroy {
  /** Min date pour limiter la sélection de date dans le popup */
  @Input() min: Date | undefined;
  @Input() max: Date | undefined;
  /** Min date dans la saisie manuelle de date. A utiliser en combinaison avec directive isValidateDate */
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() submitted: boolean;
  @Input() inputClass: string;
  @Input() showTime = false;
  @Input() hourFormat: string;
  /** Inclure erreur "required" dans les messages à afficher au-dessous le composant */
  @Input() messageRequired: boolean;
  /** AppendTo: Par exemple "body" si le calendrier est dans un dialog */
  @Input() appendTo: string;

  /** Flag pour indiquer si le champ est éditable selon le droit de modification du champ (t_dataperm).
   * Si un projet n'applique pas des droits sur les champs, ce flag n'est pas appliqué non plus */
  @Input() security = true;
  /** Set the date to highlight on first opening if the field is blank */
  @Input() defaultDate = new Date();
  /** Minutes to change per step */
  @Input() stepMinute = 1;
  /** Whether to automatically manage layering in case of overlapping components */
  @Input() autoZIndex = true;
  /** Base zIndex value to use in layering. The component with the highest x index is the top-most */
  @Input() baseZIndex = 0;

  /**
   * L'objet NgControl (avec erreurs de validation) associé avec ce composant)
   */
  inputControl: NgControl;

  /** Valeur saisi */
  innerValue: Date | undefined;

  /** Les libellés du calendrier dans le locale actuel */
  locale: any;

  /* Modification de ngModel ou ngControl */
  protected onChange: (value: any) => void;
  protected onTouched: () => void;

  protected langSub: Subscription;

  constructor(
    protected translateService: TranslateService,
    protected injector: Injector,
    public user: UserService,
    protected config: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.inputControl = this.injector.get<NgControl>(NgControl);
    this.translate(this.translateService.currentLang);
    this.langSub = this.translateService.onLangChange.subscribe((params: LangChangeEvent) => {
      this.translate(params.lang);
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    this.innerValue = v;
    if (v instanceof Date) {
      // Time zone issue: https://forum.primefaces.org/viewtopic.php?t=48507
      if (this.showTime) {
        this.onChange(new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate(), v.getHours(), v.getMinutes())));
      } else {
        this.onChange(new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate())));
      }
    } else {
      this.onChange(null);
    }
  }

  writeValue(value: Date | string | undefined) {
    if (value === undefined) {
      this.innerValue = undefined;
    } else {
      if (typeof value === 'string') {
        // format text
        this.innerValue = new Date(this.format(value));
      } else {
        // format Date js
        this.innerValue = value;
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // Set touched on blur
  onBlur() {
    this.onTouched();
  }

  /**
   * Une date reçu en format dd.MM.yyyy ou yyyy-mm-dd est formaté en yyyy/mm/dd pour être compatible avec p-calendar.
   */
  protected format(value: string): string {
    // Tableau de pattern
    const datePatterns = [
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
      /^(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{1,2})$/,
      /^(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/,
      /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
    ];
    let day;
    let month;
    let year;
    let hours;
    let minutes;

    let result = value.match(datePatterns[0]); // 15.12.2019
    if (result) {
      day = result[1];
      month = result[2];
      year = result[3];
    }
    result = value.match(datePatterns[1]); // 15.08.2019 14:45
    if (result) {
      day = result[1];
      month = result[2];
      year = result[3];
      hours = result[4];
      minutes = result[5];
    }
    result = value.match(datePatterns[2]); // 15.8.2019 14:45:22
    if (result) {
      day = result[1];
      month = result[2];
      year = result[3];
      hours = result[4];
      minutes = result[5];
    }
    result = value.match(datePatterns[3]); // 2019-08-15
    if (result) {
      day = result[3];
      month = result[2];
      year = result[1];
    }
    result = value.match(datePatterns[4]); // 2019-08-15 14:45:22
    if (result) {
      day = result[3];
      month = result[2];
      year = result[1];
      hours = result[4];
      minutes = result[5];
    }
    result = value.match(datePatterns[5]); // 2019-08-15 14:45:22
    if (result) {
      day = result[3];
      month = result[2];
      year = result[1];
      hours = result[4];
      minutes = result[5];
    }

    if (year !== undefined) {
      if (hours !== undefined) {
        return `${year}/${month}/${day} ${hours}:${minutes}`;
      } else {
        return `${year}/${month}/${day}`;
      }
    }
    return value;
  }

  private initLocale(lang: string) {
    switch (lang) {
      case 'fr':
        this.locale = {
          closeText: 'Fermer',
          prevText: 'Précedent',
          nextText: 'Suivant',
          currentText: 'Actuel',
          monthNames: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre',
          ],
          monthNamesShort: ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'aoû', 'sep', 'oct', 'nov', 'déc'],
          dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
          dayNamesShort: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
          dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
          weekHeader: 'Sem',
          firstDay: 1,
          firstDayOfWeek: 1,
          isRTL: false,
          showMonthAfterYear: false,
          yearSuffix: '',
        };
        break;
      case 'de':
        this.locale = {
          closeText: 'Schliessen',
          prevText: 'Vorherige',
          nextText: 'Nächste',
          currentText: 'Aktuelle',
          monthNames: [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember',
          ],
          monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
          dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          dayNamesMin: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
          weekHeader: 'Woche',
          firstDay: 1,
          firstDayOfWeek: 1,
          isRTL: false,
          showMonthAfterYear: false,
          yearSuffix: '',
        };
        break;
      case 'it':
        this.locale = {
          closeText: 'Chiudere',
          prevText: 'Precedente',
          nextText: 'Seguente',
          currentText: 'Attuale',
          monthNames: [
            'Gennaio',
            'Febbraio',
            'Marzo',
            'Aprile',
            'Maggio',
            'Giugno',
            'Luglio',
            'Agosto',
            'Settembre',
            'Ottobre',
            'Novembre',
            'Dicembre',
          ],
          monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
          dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
          dayNamesShort: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
          dayNamesMin: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
          weekHeader: 'Settimana',
          firstDay: 1,
          firstDayOfWeek: 1,
          isRTL: false,
          showMonthAfterYear: false,
          yearSuffix: '',
        };
        break;
      default:
        this.locale = {
          closeText: 'Close',
          prevText: 'Previous',
          nextText: 'Next',
          currentText: 'Current',
          monthNames: [
            'January',
            'February',
            'Mars',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          weekHeader: 'Week',
          firstDay: 1,
          firstDayOfWeek: 1,
          isRTL: false,
          showMonthAfterYear: false,
          yearSuffix: '',
        };
    }
  }

  /**
   * On initialise la langue pour fournir les bonnes traductions pour le calendrier
   * pour plus d'info, voir :
   * https://www.primefaces.org/primeng-v14/i18n
   * @param lang langue actuelle de type string
   */
  translate(lang: string) {
    this.initLocale(lang);
    this.config.setTranslation(this.locale);
  }
}
