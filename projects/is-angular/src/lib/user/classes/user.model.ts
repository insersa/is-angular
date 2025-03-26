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

import { ActionPermissions, BooleanPermissions } from './permission.model';

interface Info {
  [key: string]: string | number | boolean; // Adjust the types as needed
}

/**
 * The user and the user rights.
 */
export class User {
  id: number | undefined;
  username: string | undefined;
  menus: BooleanPermissions = {};
  actions: ActionPermissions = {};
  writeFields: BooleanPermissions;
  readFields: BooleanPermissions;
  lang: string | undefined;
  info: Info = {};
  /** Statut: VALID ou INITIAL_LOGON */
  status: string;

  /**
   * Constructor.
   *
   * @param id the user id
   * @param username the username
   * @param menus the menu rights
   * @param actions the action rights
   * @param lang the language
   * @param write droits d'écriture sur les champs (optionnel)
   * @param read droits de lecture sur les champs (optionnel)
   */
  constructor(
    id?: number,
    username?: string,
    menus?: BooleanPermissions,
    actions?: ActionPermissions,
    lang?: string,
    write?: BooleanPermissions,
    read?: BooleanPermissions
  ) {
    this.id = id;
    this.username = username;
    this.menus = menus || {};
    this.actions = actions || {};
    this.lang = lang;
    this.writeFields = write || {};
    this.readFields = read || {};
  }

  /**
   * Check if the user has the rights to use the action on the menu.
   *
   * @param menu the menu name (the business object name)
   * @param action the name of the action (CREATE, EDIT, ...)
   * @returns <code>true</code> if the user has the rights to use the action on the menu
   */
  isAuthAction(menu: string, action: string): boolean {
    if (this.actions[menu] === undefined) {
      return true;
    }
    return this.actions[menu].indexOf(action) >= 0;
  }

  /**
   * Check if the user has the rights to use the menu.
   *
   * @param menu the menu name (the business object name)
   * @returns <code>true</code> if the user has the rights to use the menu
   */
  isAuthMenu(menu: string): boolean {
    if (this.menus[menu] === undefined) {
      return true;
    }
    return this.menus[menu];
  }

  /**
   *
   * @param field name of field
   * @returns true if the user is authorized to modify the field
   */
  isAuthWrite(field: string): boolean {
    if (!this.writeFields) {
      return true;
    }
    return this.writeFields[field] !== undefined && this.writeFields[field];
  }

  /**
   *
   * @param field field name
   * @returns true if the user is authorized to read the field
   */
  isAuthRead(field: string): boolean {
    if (!this.readFields) {
      return true;
    }
    return this.readFields[field] !== undefined && this.readFields[field];
  }

  /**
   * Returns true if the user is authorized to read at least one of the fields
   * @param fields list of fields
   */
  isAuthReadFields(fields: string[]): boolean {
    for (const field of fields) {
      if (this.isAuthRead(field)) {
        return true;
      }
    }
    return false;
  }
}
