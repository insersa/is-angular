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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HandleError, HttpErrorHandler } from '../../error/services/http-error-handler.service';
import {
  Sort,
  ValueObject,
  RecordsResponse,
  FieldsResponse,
  Params,
  CountResponse,
  RecordResponse,
  DeleteResponse,
} from '../../models/interfaces/object.interface';
import { TokenService } from '../../user/services/token.service';
import { UrlConfig } from '../../util/config';

/**
 * Service pour CRUD objets métier
 */
@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  service = 'objects';

  /** Handler pour traiter les erreurs de requêtes HTTP */
  private handleError: HandleError;

  /**
   *
   * @param url le url
   * @param query la requête
   * @returns url avec la requête inclu
   */
  private static addQuery(url: string, query: ValueObject): string {
    let queryUrl = url;
    if (query) {
      queryUrl = url + '?query=' + encodeURIComponent(JSON.stringify(query));
    }
    return queryUrl;
  }

  /**
   *
   * @param url le url (avec critères de recherche)
   * @param sort tri, p.ex. {'desc': 'ani_type'}
   * @returns url avec critère de tri
   */
  private static addSort(url: string, sort: Sort): string {
    if (!sort) {
      return url;
    }
    let separator = '?';
    if (url.indexOf('?') >= 0) {
      separator = '&';
    }
    if (sort.sort) {
      return `${url}${separator}sort=${sort.sort}`;
    }
    return `${url}${separator}desc=${sort.desc}`;
  }

  /**
   *
   * @returns url with params
   */
  private static addStringParam(url: string, name: string, value: string): string {
    if (!value) {
      return url;
    }
    let operator = '?';
    if (url.indexOf('?') >= 0) {
      operator = '&';
    }
    return `${url}${operator}${name}=${value}`;
  }

  constructor(
    public http: HttpClient,
    private token: TokenService,
    private urlConfig: UrlConfig,
    private logger: NGXLogger,
    httpErrorHandler: HttpErrorHandler
  ) {
    this.handleError = httpErrorHandler.createHandleError('ObjectService');
  }

  /**
   * Cherche une collection d'objets selon type, critères de recherche et option de tri
   * @param type Nom de l'objet métier dans le config
   * @param query Critères de recherche
   * @param sort Tri
   * @param range tranche de résultat ex. '1-10'
   * @returns la liste d'objets
   */
  public getList(type: string, query?: ValueObject, sort?: Sort, range?: string): Observable<RecordsResponse> {
    // this.logger.debug('Getting objects. Type:', type);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    const url = this.getUrlWithParams({
      type: type,
      query: query,
      sort: sort,
      range: range,
    });
    return this.http.get<RecordsResponse>(url, httpOptions).pipe(
      map((res: RecordsResponse) => {
        this.token.token = res['token'];
        return res;
      }),
      catchError(this.handleError('getList'))
    ) as Observable<RecordsResponse>;
  }

  /**
   * Get a collection of values instead of records
   * @param type Object name
   * @param query THe search criteria
   * @param fieldname name of the field to be collected
   * @returns the list of values for a given field
   */
  public getFieldsRequest(type: string, fieldname: string, query?: ValueObject, sort?: Sort): Observable<FieldsResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    const url = this.getUrlWithParams({
      type: type,
      query: query,
      fieldname: fieldname,
      sort: sort,
    });
    return this.http.get<FieldsResponse>(url, httpOptions).pipe(
      map((res: any) => {
        this.token.token = res['token'];
        return res;
      }),
      catchError(this.handleError('getFieldsRequest'))
    ) as Observable<FieldsResponse>;
  }

  /**
   * Creates a list in CSV format
   * @param params object with CSV parameters: type, query, sort, range, fields, labelkeys, language
   * @returns the CSV as a blob
   */
  public getCSV(params: any): Observable<unknown | Blob> {
    params['format'] = 'csv';
    const url = this.getUrlWithParams(params);
    const httpOptions: { headers: HttpHeaders; responseType: 'blob' } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
      responseType: 'blob',
    };
    return <Observable<unknown | Blob>>this.http.get(url, httpOptions).pipe(
      map((data) => {
        return new Blob([data], { type: 'text/csv' });
      }),
      catchError(this.handleError('getCSV'))
    );
  }

  /**
   *
   * @param params paramètres à mettre dans le url
   * @returns url avec les paramètres
   */
  private getUrlWithParams(params: Params): string {
    let url = `${this.urlConfig.url}/${this.service}/${params['type']}`;
    url = ObjectService.addQuery(url, params['query'] as ValueObject);
    url = ObjectService.addSort(url, params['sort'] as Sort);
    for (const param of ['range', 'format', 'fields', 'labelkeys', 'language', 'fieldname']) {
      url = ObjectService.addStringParam(url, param, params[param] as string);
    }
    return url;
  }

  /**
   * Compte le nombre d'enregistrements selon type et critères de recherche
   * @param type Nom de l'objet métier dans le config
   * @param query Critères de recherche
   * @returns la liste d'objets
   */
  public getListCount(type: string, query?: any): Observable<CountResponse> {
    // this.logger.debug('Getting objects. Type:', type);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    const url = ObjectService.addQuery(`${this.urlConfig.url}/${this.service}/${type}/count`, query);
    return this.http.get<CountResponse>(url, httpOptions).pipe(
      map((res: any) => {
        this.token.token = res['token'];
        return res;
      }),
      catchError(this.handleError('getListCount'))
    ) as Observable<CountResponse>;
  }

  /**
   *
   * @param id l'identifiant de l'objet
   * @param type nom de l'objet métier
   * @param includeChildren flag inclure enfants, par défaut true au niveau backend
   * @returns the json of one object {'record':{l'enregistrement}, 'token':le token}
   */
  public getRecord(id: number, type: string, includeChildren?: boolean): Observable<RecordResponse> {
    let url = `${this.urlConfig.url}/${this.service}/${type}/${id}`;
    if (includeChildren !== undefined) {
      url = `${url}?includeChildren=${includeChildren}`;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    // this.logger.debug('Getting ', type, id);
    return this.http.get<RecordResponse>(url, httpOptions).pipe(
      map((data: RecordResponse) => {
        this.token.token = data['token'];
        return data;
      }),
      catchError(this.handleError('getRecord'))
    ) as Observable<RecordResponse>;
  }

  /**
   * Créé un PDF pour un enregistrement
   * @param id id de l'objet métier
   * @param type nom de l'objet métier
   * @param lang langue du pdf
   * @returns le PDF comme objet blob
   */
  public getPDF(id: number, type: string, lang: string): Observable<Record<string, never> | Blob> {
    const url = `${this.urlConfig.url}/${this.service}/${type}/${id}?format=pdf&lang=${lang}`;
    const httpOptions: { headers: HttpHeaders; responseType: 'blob' } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
      responseType: 'blob',
    };
    return this.http.get(url, httpOptions).pipe(
      map((blob) => {
        return new Blob([blob], { type: 'application/pdf' });
      }),
      catchError(this.handleError('getPDF', [], {}))
    );
  }

  /**
   *
   * @param id record id
   * @param type name of business object
   * @param rec the record
   * @param skip liste of HTTP error codes not to be catched, ex. 409
   */
  public delete(id: number, type: string, rec: any, skip?: number[]): Observable<DeleteResponse> {
    this.logger.debug('ObjectService.delete. Demande de delete.', type, id);
    const httpOptions: { headers: HttpHeaders; body: string } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
      body: JSON.stringify(rec),
    };
    return this.http.delete<DeleteResponse>(`${this.urlConfig.url}/${this.service}/${type}/${id}`, httpOptions).pipe(
      map((data: DeleteResponse) => {
        this.token.token = data['token'];
        return data;
      }),
      catchError(this.handleError('delete', skip))
    ) as Observable<DeleteResponse>;
  }

  /**
   * Enregistrer un formulaire
   * @param id id de l'objet (optionnel)
   * @param type type de l'objet métier
   * @param rec l'enregistrement
   * @returns résultat de création ou update
   */
  public submit(id: number | undefined, type: string, rec: any): Observable<RecordResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    if (id) {
      return this.update(id, type, JSON.stringify(rec), httpOptions);
    }
    return this.create(type, JSON.stringify(rec), httpOptions);
  }

  private update(id: number, type: string, body: string, options: any): Observable<RecordResponse> {
    // console.log('Updating form. Id: ' + id + '. Form: ' + body);
    return this.http.put<RecordResponse>(`${this.urlConfig.url}/${this.service}/${type}/${id}`, body, options).pipe(
      map((data) => {
        const recordResponse = data as unknown as RecordResponse;
        this.token.token = recordResponse['token'];
        return data;
      }),
      catchError(this.handleError('update'))
    ) as unknown as Observable<RecordResponse>;
  }

  private create(type: string, body: string, options: any): Observable<RecordResponse> {
    // console.log('Creating form: ' + body);
    return this.http.post<RecordResponse>(`${this.urlConfig.url}/${this.service}/${type}`, body, options).pipe(
      map((data) => {
        const recordResponse = data as unknown as RecordResponse;
        this.logger.debug('ObjectService.create Id: ', recordResponse['id']);
        this.token.token = recordResponse['token'];
        return data;
      }),
      catchError(this.handleError('create'))
    ) as unknown as Observable<RecordResponse>;
  }

  /**
   * Save a list of records adding, updating and deleting it.
   * @param type the business object type
   * @param records the records to be added and/or updated if changed
   * @param deleted the records to be deleted
   * @returns the recorded records
   */
  public submitList(type: string, records: any, deleted?: any): Observable<any> {
    const body = new URLSearchParams();
    if (records !== undefined) {
      body.append('records', JSON.stringify(records));
    }
    if (deleted !== undefined) {
      body.append('deletes', JSON.stringify(deleted));
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        token: this.token.token ? this.token.token : '',
      }),
    };
    return this.http.put(`${this.urlConfig.url}/${this.service}/${type}`, body.toString(), httpOptions).pipe(
      map((data: any) => {
        this.token.token = data['token'];
        return data;
      }),
      catchError(this.handleError('submitList'))
    );
  }

  /**
   * Met à jour un groupe de champs
   * @param type nom de l'objet métier
   * @param id id de l'enregistrement
   * @param values valeurs à enregistrer
   * @returns nbr de champs mises à jour
   */
  public updateFields(type: string, id: number, patch: any[]): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    return this.http.patch(`${this.urlConfig.url}/${this.service}/${type}/${id}`, JSON.stringify(patch), httpOptions).pipe(
      map((data: any) => {
        this.token.token = data['token'];
        return data;
      }),
      catchError(this.handleError('updateFields'))
    );
  }
}
