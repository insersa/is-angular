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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ErrorModule } from '../error/error.module';
import { UrlConfig } from '../util/config';

import { PermissionService } from './services/permission.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, ErrorModule],
  providers: [PermissionService, TokenService, UserService, JwtHelperService, provideHttpClient(withInterceptorsFromDi())],
})
/**
 * Module to manage users, tokens, permissions, ...
 */
export class UserModule {
  static forRoot(urlConfigFactory: () => { url: string }): ModuleWithProviders<UserModule> {
    return {
      ngModule: UserModule,
      providers: [{ provide: UrlConfig, useFactory: urlConfigFactory }],
    };
  }
}
