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

import { EventEmitter, Injectable } from '@angular/core';

/**
 * Service to share properties between components and storing it in a session storage to retrieve it (when the application is reloaded).
 */
@Injectable({
  providedIn: 'root',
})
export class SessionService {
  /**
   * Emit an event when a property value change: { name: name, value: value }.
   */
  public onPropertyChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  /**
   * Get a property value.
   *
   * @param name the property name
   */
  public static getProperty(name: string): string | null {
    return sessionStorage.getItem(name);
  }

  /**
   * Set a property and emit an event if the property value has changes.
   *
   * @param name the property name
   * @param value the property value
   */
  public setProperty(name: string, value: string): void {
    if (value !== sessionStorage.getItem(name)) {
      sessionStorage.setItem(name, value);
      this.onPropertyChange.emit({ name: name, value: value });
    }
  }
}
