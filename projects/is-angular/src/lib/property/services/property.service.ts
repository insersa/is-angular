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

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { TokenService } from '../../user/services/token.service';
import { URL_CONFIG_TOKEN } from '../../util/config';
interface Properties {
  [key: string]: string | undefined;
}

interface HttpOptions {
  headers: HttpHeaders;
}

interface PropertiesResponse {
  [key: string]: string;
}

/**
 * Service to manage the application properties.
 */
@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  /**
   * The properties cache.
   */
  private _properties: Properties = {};

  /**
   * Constructor.
   *
   * @param url the base url
   * @param http the http service
   * @param logger the logger service
   * @param token the token service
   */
  constructor(
    @Inject(URL_CONFIG_TOKEN) private url: string,
    @Inject(HttpClient) private http: HttpClient,
    private logger: NGXLogger,
    private token?: TokenService
  ) {}

  /**
   * Load the properties.
   * @returns the promise to load the properties
   */
  load() {
    // -- Charger le token si possible (sans token réception non complète des traductions)
    let httpOptions: HttpOptions;
    if (this.token?.token && this.token.token.length > 0) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          token: this.token.token,
        }),
      };
    }

    return new Promise<void>((resolve) => {
      this.http.get<PropertiesResponse>(`${this.url}/properties`, httpOptions).subscribe((properties: PropertiesResponse) => {
        this.logger.debug('PropertyService.load - properties loaded', properties);

        // Insérer la clé pour le session storage dans tokenService
        this.token?.setTokenKey(properties['security.token.storage.key']);

        // -- Reprise du nouveau token si présent
        if (properties['token'] && this.token) {
          this.token.token = properties['token'];
          delete properties['token'];
        }

        // -- Enregistrer les propriétés
        this._properties = properties;

        // -- Vérifier si token est existant autrement refaire la requête
        if (httpOptions === undefined && this.token?.token) {
          this.load();
        }
        resolve();
      });
    });
  }

  /**
   * Get the properties.
   * @returns the properties
   */
  get properties(): Properties {
    return this._properties;
  }

  /**
   * Get a specific property by key.
   * @param key the property key
   * @returns the property value
   */
  getProperty(key: string): string | undefined {
    return this._properties[key];
  }
}
