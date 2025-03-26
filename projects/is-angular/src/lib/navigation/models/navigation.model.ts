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

/**
 * The information required to navigate between records of a list using buttons Next, Previous and Return to list
 */
import { Mode } from '../../object/pages/object-detail/object-detail.component';
import { Tools } from '../../util/tools';

export class Navigation {
  /** Route for returning to the search results */
  searchRoute: string;
  /** Parameters for returning to the search results */
  searchParams: any;
  /** Route of the selected record (without the id) */
  navRoute: string;
  /** Query for loading more elements of the list */
  navQuery: any;
  /** Sort object {sort/desc: fieldname}, in case more data needs to be loaded */
  navSort: any;
  /** The list being browsed, possible a subset of the total count */
  list: any[];
  /** Total count of search results */
  listCount: number;
  /** Name of the business object */
  type: string;
  /** Name of the parent business object, if navigation starts by selecting child record in a parent form */
  parentType: string | undefined;
  /** Parent mode: search or consult, useful for choosing label for "Return to list"/"Return to parent" button */
  parentMode: Mode | undefined;

  /**
   *
   * @param object infos for the navigation
   */
  constructor(object: {
    searchRoute: string;
    searchParams: any;
    type: string;
    navRoute: string;
    navQuery?: any;
    navSort?: any;
    list?: any[];
    listCount?: number;
    parentType?: string;
    parentMode?: Mode;
  }) {
    this.searchRoute = object.searchRoute;
    this.searchParams = Tools.clone(object.searchParams);
    this.type = object.type;
    this.navRoute = object.navRoute;
    this.navQuery = object.navQuery ? object.navQuery : this.searchParams['query'];
    this.navSort = object.navSort;
    this.list = object.list ? object.list : [];
    this.listCount = object.listCount ? object.listCount : this.list.length;
    this.parentType = object.parentType;
    this.parentMode = object.parentMode;
  }
}
