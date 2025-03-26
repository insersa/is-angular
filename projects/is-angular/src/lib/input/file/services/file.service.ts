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
import { map } from 'rxjs/operators';

import { TokenService } from '../../../user/services/token.service';
import { UrlConfig } from '../../../util/config';

/**
 * Service for uploading and downloading a document with the FileResource in is-rest
 */
@Injectable({
  providedIn: 'root',
})
export class FileService {
  /** Resource pour les fichiers UPLOAD/DOWNLOAD */
  private fileUrl: string;

  constructor(urlConfig: UrlConfig, private http: HttpClient, private token: TokenService, private logger: NGXLogger) {
    this.fileUrl = `${urlConfig.url}/file`;
  }

  /**
   * Temporary file upload before the business object record is saved
   * @param file the file to be uploaded
   * @returns reference to the uploaded file
   */
  upload(file: FileList): Observable<any> {
    this.logger.debug('Uploading file', file[0].name);

    const formData: FormData = new FormData();
    formData.append('uploadFile', file[0], file[0].name);

    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };

    return this.http.post(this.fileUrl, formData, httpOptions).pipe(
      map((res: any) => {
        this.token.token = res['token'];
        return res;
      })
    );
  }

  /**
   * Uploads a file with an encoded file name.
   * @param file The file to be uploaded.
   * @param encodedFileName The encoded file name to use for the upload.
   * @returns Observable of the upload result.
   */
  uploadWithEncodedFileName(file: FileList, encodedFileName: string): Observable<any> {
    this.logger.debug('Uploading file', encodedFileName, 'to', this.fileUrl);

    const formData: FormData = new FormData();
    // Use the encodedFileName for the 'name' parameter while appending the file to FormData
    formData.append('uploadFile', file[0], encodedFileName);

    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };

    return this.http.post(this.fileUrl, formData, httpOptions).pipe(
      map((res: any) => {
        // Update the token if necessary or handle the response
        this.token.token = res['token'];
        return res;
      })
    );
  }

  /**
   * Remove a file
   *
   * @param id id of the record from which to remove the file
   * @param objName optional, used when the file is in a different table than T_DOCUMENT
   * @returns the http response with status and no json content apart from the token
   */
  remove(id: number, objName?: string): Observable<any> {
    console.log('Delete file, record id :', id);

    // Création du headers
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
    };
    let url = `${this.fileUrl}/${id}`;
    if (objName) {
      url = `${url}?objectname=${objName}`;
    }
    return this.http.delete(url, httpOptions).pipe(
      map((res) => {
        // Retour du token
        this.token.token = this.token.token ? this.token.token : '';
        // Réponse du serveur
        return res;
      })
    );
  }

  /**
   * Download file
   * @param id the id of the record that holds the file
   * @param objName the object name, if different from Document
   * @param mimetype (optional)
   * @param fieldName name of object field (used only in combination with object name)
   * @returns the file content as a blob
   */
  download(id: number, objName?: string, mimetype?: string, fieldName?: string) {
    let url = `${this.fileUrl}/${id}`;
    if (objName) {
      url = `${url}?objectname=${objName}`;
      if (fieldName) {
        url = `${url}&fieldname=${fieldName}`;
      }
    }
    const httpOptions: { headers: HttpHeaders; responseType: 'blob' } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token ? this.token.token : '',
      }),
      responseType: 'blob',
    };
    return this.http.get(url, httpOptions).pipe(
      map((data) => {
        if (mimetype) {
          return new Blob([data], { type: mimetype });
        }
        return new Blob([data]);
      })
    );
  }
}
