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

import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { MessageService } from '../../services/message.service';

/**
 * Messages d'erreur, info et warning pour l'utilisateur
 */
@Component({
  selector: 'is-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  constructor(public messageService: MessageService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      // Clean the messages at the beginning of every router navigation
      if (event instanceof NavigationStart) {
        this.messageService.clear();
      }
    });
  }
}
