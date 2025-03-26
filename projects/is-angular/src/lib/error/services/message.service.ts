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

import { Injectable } from '@angular/core';

/**
 * Service qui fournit des messages d'erreur à l'utilisateur, p.ex. "Modification concurrente"
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: any[] = [];

  constructor() {}

  add(severity: string, messageKey: string) {
    this.messages.push({
      severity: severity,
      summary: `status.${severity}`,
      detail: messageKey,
    });
  }

  clear() {
    this.messages = [];
  }
}
