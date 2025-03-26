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

import { AppVersionConfig } from '../../util/config';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  /**
   * The is-angular version.
   */
  libVersion = '18.0.0';

  /**
   * Service constructor.
   * @param appVersionConfig the app version configuration
   */
  constructor(private appVersionConfig: AppVersionConfig) {}

  /**
   * Log the versions.
   */
  logVersion(): void {
    console.log(`is-angular version ${this.libVersion}`);
    console.log(`app version ${this.appVersion}`);
  }

  /**
   * Get the app version.
   * @returns the app version
   */
  get appVersion(): string {
    return this.appVersionConfig.version;
  }
}
