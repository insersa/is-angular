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

import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

import { TranslateRestLoader } from './translate-rest-loader';

/**
 * Class to handle the missing translations from the TranslateRestLoader.
 */
export class MissingRestTranslationHandler implements MissingTranslationHandler {
  /**
   * Log the missing translation and return the key.
   *
   * @param params context for resolving a missing translation
   * @returns the key
   */
  handle(params: MissingTranslationHandlerParams) {
    (<TranslateRestLoader>params.translateService.currentLoader).logMissing(params);
    return `[${params.key}]`;
  }
}
