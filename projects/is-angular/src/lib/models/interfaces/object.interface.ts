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

export interface Sort {
  sort?: string;
  desc?: string;
}

export interface NavigationInfo {
  index: number;
  type: string;
  searchRoute: string;
  searchParams: object;
  navRoute: string;
  navQuery: object;
  navSort: Sort;
  list: number[];
  listCount: number;
}
/**
 * Child navigation
 *
 */
export interface ChildNavigations {
  [key: string]: {
    route: string;
    query: {
      [key: string]: string;
      type: string;
    };
    idField: string;
  };
}

export interface ValueObject {
  [key: string]: string | number | boolean | Date | object | object[] | Children | undefined;
}

export interface Children {
  [key: string]: ValueObject[];
}

export interface Params {
  [key: string]: string | ValueObject | Sort | undefined;
}

export interface FieldInfo {
  length: number;
  required: boolean;
  readonly: boolean;
  min: number;
  max: number;
  pattern: string;
}

export interface RecordResponse {
  record?: ValueObject;
  id?: number;
  token?: string;
  valid?: boolean;
  status?: number;
}

export interface RecordsResponse {
  records: ValueObject[];
  ids: number[];
  token?: string;
}

export interface CountResponse {
  count: number;
  token?: string;
}

export interface FieldsResponse {
  fields: number;
  token?: string;
}

export interface DeleteResponse {
  status?: string;
  token?: string;
}

export interface Patch {
  date: Date | string;
  op: string;
  path: string;
  value: string | number | boolean | Date;
}
