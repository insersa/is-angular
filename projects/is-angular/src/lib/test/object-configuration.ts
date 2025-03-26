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

import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ObjectFieldsService } from '../object/services/object-fields.service';
import { ObjectInitService } from '../object/services/object-init.service';
import { ObjectService } from '../object/services/object.service';

/*********************** OBJECT SERVICE STUB *************************/
/**
 * Exemple de Stub
 */
const objectServiceStub = {};

/**
 * Configurer le stub pour le service
 *
 */
export function getObjectServiceStubProvider(): any {
  return { provide: ObjectService, useValue: objectServiceStub };
}

/*********************** OBJECT SERVICE MOCK *************************/

@Injectable()
export class ObjectServiceMock {
  public getList(_type: string, _query?: any, _sort?: any, _range?: string): Observable<any> {
    return of({ records: [] });
  }

  public getCSV(_params: any): Observable<any> {
    return of(null);
  }

  public getListCount(_type: string, _query?: any): Observable<any> {
    return of({ count: 0 });
  }

  public getRecord(_id: number, _type: string): Observable<any> {
    return of({ record: {} });
  }

  public delete(_id: number, _type: string, _rec: any): Observable<any> {
    return of({});
  }

  public submit(_id: number, _type: string, _rec: any): Observable<any> {
    return of({});
  }
}

/*********************** OBJECT FIELDS MOCK *************************/

@Injectable()
export class ObjectFieldsServiceMock {
  public getFieldInfo(_type: string): Observable<any> {
    return of({});
  }
}

/*********************** OBJECT INIT MOCK *************************/

@Injectable()
export class ObjectInitServiceMock {
  public getInitObject(_type: string, _mode: string): Observable<any> {
    return of({ record: { id: 1 } });
  }
}

/*********************** OBJECT MODULE MOCK *************************/

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    { provide: ObjectService, useClass: ObjectServiceMock },
    { provide: ObjectFieldsService, useClass: ObjectFieldsServiceMock },
    { provide: ObjectInitService, useClass: ObjectInitServiceMock },
  ],
})
/**
 * Module mock pour les services des objets métier
 *
 * (comme AbstractBackedBean, AbstractJsfBbBean, AbstractListBean dans JSF)
 */
export class ObjectModuleMock {}
