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

import { InjectionToken } from '@angular/core';
/**
 * Classes pour injections de config dans les services ou autres.
 */

/**
 * Configure the URL.
 */
export class UrlConfig {
  url: string;
}

export const URL_CONFIG_TOKEN = new InjectionToken<string>('URL_CONFIG_TOKEN', { factory: () => '/services' });

/**
 * Configure the token key in the session storage.
 */
export class TokenConfig {
  key: string;
}

/**
 * Configure the app version.
 */
export class AppVersionConfig {
  version: string;
}
