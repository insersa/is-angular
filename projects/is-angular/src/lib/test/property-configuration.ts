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

import { PropertyService } from '../property/services/property.service';

/**
 * Object to be returned by the PropertyService sub.
 *
 */
const propertyServiceStub = {
  properties: {
    'application.behavior': 'dev',
    'security.token.storage.key': 'testapp-token',
    'result.maxrows': '12',
    'document.extensions': 'pdf,txt',
  },
};

/**
 * PropertyService stub.
 *
 * @returns stub
 */
export function getPropertyServiceStubProvider(): any {
  return { provide: PropertyService, useValue: propertyServiceStub };
}
