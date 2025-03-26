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

// Generic interface for permissions that can be applied to menus, write fields, and read fields
// Base interface for boolean permissions
export interface BooleanPermissions {
  [key: string]: boolean;
}

// Specific interface for action permissions
export interface ActionPermissions {
  [key: string]: string[];
}

/**
 * The permission model
 */
export class Permission {
  actions: ActionPermissions;
  menus: BooleanPermissions;
  writeFields: BooleanPermissions;
  readFields: BooleanPermissions;

  constructor(obj?: {
    actions?: ActionPermissions;
    menus?: BooleanPermissions;
    writeFields?: BooleanPermissions;
    readFields?: BooleanPermissions;
  }) {
    this.actions = obj?.actions || {};
    this.menus = obj?.menus || {};
    this.writeFields = obj?.writeFields || {};
    this.readFields = obj?.readFields || {};
  }
}
