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

import { JwtModule } from '@auth0/angular-jwt';

/**
 * Get a token setter for testin purposes.
 */
function tokenGetter() {
  return sessionStorage.getItem('test-token');
}

/**
 * Get a mocked JwtModule for testing purposes.
 */
export function getJwtModule(): any {
  return JwtModule.forRoot({ config: { tokenGetter: tokenGetter } });
}
