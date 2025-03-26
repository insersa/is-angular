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

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Simulate server replying to file upload request */
@Injectable()
export class UploadInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('/upload/file') === -1) {
      return next.handle(req);
    }
    const delay = 300;
    return createUploadEvents(delay);
  }
}

/** Create simulation of upload event stream */
function createUploadEvents(delay: number) {
  // Simulate XHR behavior which would provide this information in a ProgressEvent
  const chunks = 5;
  const total = 12345678;
  const chunkSize = Math.ceil(total / chunks);

  return new Observable<HttpEvent<any>>((observer) => {
    // notify the event stream that the request was sent.
    observer.next({ type: HttpEventType.Sent });

    uploadLoop(0);

    function uploadLoop(loaded: number) {
      // N.B.: Cannot use setInterval or rxjs delay (which uses setInterval)
      // because e2e test won't complete. A zone thing?
      // Use setTimeout and tail recursion instead.
      setTimeout(() => {
        loaded += chunkSize;

        if (loaded >= total) {
          const doneResponse = new HttpResponse({
            status: 201, // OK but no body;
          });
          observer.next(doneResponse);
          observer.complete();
          return;
        }

        const progressEvent: HttpProgressEvent = {
          type: HttpEventType.UploadProgress,
          loaded,
          total,
        };
        observer.next(progressEvent);
        uploadLoop(loaded);
      }, delay);
    }
  });
}
