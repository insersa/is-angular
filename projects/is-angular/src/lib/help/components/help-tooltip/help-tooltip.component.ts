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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { HelpService } from '../../services/help.service';

/**
 * Tooltip attached to input label, displaying short and long help texts for the label, if available
 */
@Component({
  selector: 'is-help-tooltip',
  templateUrl: './help-tooltip.component.html',
  styleUrls: ['./help-tooltip.component.scss'],
})
export class HelpTooltipComponent implements OnInit, OnDestroy {
  /** Label key */
  @Input() key = '';

  /** Short help text */
  public shortText: string | undefined;
  /** Long help text in HTML */
  public longText: string | undefined;
  /** Changement de langue*/
  private langEvent: Subscription;

  constructor(private help: HelpService, private translate: TranslateService, private logger: NGXLogger) {}

  ngOnInit() {
    this.initHelp(this.translate.currentLang);
    this.langEvent = this.translate.onLangChange.subscribe((result: any) => {
      this.initHelp(result.lang);
    });
  }

  ngOnDestroy(): void {
    if (this.langEvent) {
      this.langEvent.unsubscribe();
    }
  }

  private initHelp(language: string) {
    if (!language || !this.help) {
      return;
    }
    this.help.getHelp().subscribe(
      (result: any) => {
        if (result && result[this.key] && result[this.key][language]) {
          this.shortText = result[this.key][language]['short'];
          this.longText = result[this.key][language]['long'];
        } else {
          this.shortText = undefined;
          this.longText = undefined;
        }
      },
      (error: any) => {
        this.logger.error('Error while loading help texts for key', this.key, 'Error', error);
      }
    );
  }
}
