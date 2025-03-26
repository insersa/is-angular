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

import { EventEmitter, Injectable } from '@angular/core';

import { User } from '../user/classes/user.model';
import { UserService } from '../user/services/user.service';

/*********************** User mock ********************************/
/**
 * The user and the user rights.
 */
export class UserMock extends User {
  public lang = 'fr';

  isAuthAction(_menu: string, _action: string): boolean {
    return false;
  }

  isAuthMenu(_menu: string): boolean {
    return false;
  }

  isAuthWrite(_field: string): boolean {
    return false;
  }
}

/*********************** UserService Mock *************************/
@Injectable()
export class UserServiceMock {
  onUserChange: EventEmitter<User> = new EventEmitter<User>();

  /**
   * The current user.
   */
  currentUser = new UserMock(1, 'Test User');

  get user(): User {
    return this.currentUser;
  }

  set user(user: User) {
    this.currentUser = <UserMock>user;
    this.onUserChange.emit(this.currentUser);
  }

  set info(_info: any) {
    // Do nothing
  }

  set status(_status: string) {
    // Do nothing
  }

  /**
   * Revert the info for the user from the server.
   */
  public revertInfo() {
    // Do nothing
  }
}

/**
 * Configurer le stub pour le service utilisateur à mettre dans le providers
 *
 */
export function getUserServiceStubProvider(): any {
  return { provide: UserService, useClass: UserServiceMock };
}
