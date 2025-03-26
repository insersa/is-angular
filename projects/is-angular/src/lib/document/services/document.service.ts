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

import { TokenService } from '../../user/services/token.service';
import { UrlConfig } from '../../util/config';

/**
 * Service to open or download documents.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  /**
   * URL of the help resource
   */
  private url: string;

  constructor(private http: HttpClient, urlConfig: UrlConfig, private token: TokenService) {
    this.url = `${urlConfig.url}/documents`;
  }

  /**
   * Open or download a file (on IE only download).
   * @param key the file key
   * @param open <code>true</code> to open the file
   * @param chapter the chapter to open
   */
  public get(key: string, open = true, _chapter?: string) {
    const httpOptions: {
      headers: HttpHeaders;
      observe: 'response';
      responseType: 'blob';
    } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: this.token.token || '',
      }),
      observe: 'response',
      responseType: 'blob',
    };

    this.http.get(`${this.url}?key=${key}`, httpOptions).subscribe((response: any) => {
      this.token.token = response.headers.get('token');
      const contentType = response.headers.get('content-type');
      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition.match(/attachment;filename="(.*)"/)[1];

      const fileBlob = new Blob([response.body], { type: contentType });
      const nav = window.navigator as any;
      if (nav.msSaveOrOpenBlob) {
        // BLOB urls are not supported in IE
        // http://stackoverflow.com/questions/24007073/open-links-made-by-createobjecturl-in-ie11
        nav.msSaveOrOpenBlob(fileBlob, fileName);
      } else {
        const fileUrl = URL.createObjectURL(fileBlob);

        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.href = fileUrl;
        if (open) {
          a.target = '_blank';
        } else {
          a.download = fileName;
        }
        a.click();
        setInterval(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(fileUrl);
        }, 100);
      }
    });
  }
}
