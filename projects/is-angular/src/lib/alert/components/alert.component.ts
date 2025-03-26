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

import { UserService } from '../../user/services/user.service';
import { AlertService } from '../services/alert.service';

/**
 * Alert icon (info or warn) that opens a popup with message to users when clicked
 *
 * The popup is opened by default at login, if there is a message
 */
@Component({
  selector: 'is-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit, OnDestroy {
  /** Flag pour modifier la taille du titre à h4 au lieu de h2 dans le popup */
  @Input() smallTitle = false;

  /** Flag pour modifier la taille de l'icône "info" ou "attention" dans le popup */
  @Input() smallIcon = true;

  /** Style de la fenêtre popup p-dialog */
  @Input() style = { width: '400px' };

  private langChange: Subscription;
  private userChange: Subscription;

  public show = false;
  public message: any = {};

  /** Id de message consulté au moment de login */
  private consultedId: number;

  constructor(
    private alertService: AlertService,
    private translateService: TranslateService,
    private userService: UserService,
    private logger: NGXLogger
  ) {}

  ngOnInit() {
    this.initMessage();
    this.langChange = this.translateService.onLangChange.subscribe(() => {
      this.initMessage();
    });
    this.userChange = this.userService.onUserChange.subscribe(() => {
      this.initMessage();
    });
  }

  ngOnDestroy(): void {
    this.langChange.unsubscribe();
    this.userChange.unsubscribe();
  }

  private initMessage() {
    if (!this.userService.currentUser) {
      this.message = {};
      return;
    }
    this.alertService.getAlertMessage(this.translateService.currentLang).subscribe((result) => {
      if (result['id']) {
        this.message = result;
        if (!this.consultedId || this.consultedId !== this.message['id']) {
          this.show = true;
        }
      } else {
        this.message = {};
        if (result['status']) {
          this.logger.error('Error calling alert resource', result['status']);
        }
      }
    });
  }

  onClose() {
    this.consultedId = this.message['id'];
    this.show = false;
  }
}
