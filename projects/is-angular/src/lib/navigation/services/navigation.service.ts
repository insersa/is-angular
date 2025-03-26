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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HandleError, HttpErrorHandler } from '../../error/services/http-error-handler.service';
import { ObjectService } from '../../object/services/object.service';
import { PropertyService } from '../../property/services/property.service';
import { Navigation } from '../models/navigation.model';

/**
 * Service for performing navigation between a list of objects and its records
 *
 * 1. Next, previous
 * 2. Return to the last search results
 * 3. Select a record in a list
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  /**
   * The infos necessary to perform navigation between a list of objects and its records
   *
   * Stores the history of navigation, to easily backtrack
   *
   * Route (without id) -> Query -> {list, sort, count, url info to return to search results or parent record}
   * Everytime next is called, matches route and query to the right list of ids
   */
  protected navigations: any = {};

  /**
   * Number of records loaded at a time
   */
  protected maxRows: number;

  /** Flags for indicating when asynchronous tasks are running, ex. loading more data */
  loading = { next: false };

  /** Handler pour traiter les erreurs de requêtes HTTP */
  protected handleError: HandleError;

  constructor(
    protected router: Router,
    protected property: PropertyService,
    protected object: ObjectService,
    protected logger: NGXLogger,
    errorHandler: HttpErrorHandler
  ) {
    this.maxRows = Number(property.properties['result.maxrows']);
    this.handleError = errorHandler.createHandleError('NavigationService');
  }

  /**
   * Selects a record in a search result
   */
  selectRecord(object: {
    index: number;
    type: string;
    parentType?: string;
    searchRoute: string;
    searchParams: any;
    navRoute: string;
    navQuery?: any;
    navSort: any;
    list: number[];
    listCount: number;
  }) {
    const navInfo = new Navigation(object);
    const navQueryStr = this.initNavigation(navInfo);
    this.router.navigate([`${navInfo.navRoute}/${navInfo.list[object.index]}`], {
      queryParams: { query: navQueryStr, index: object.index },
    });
  }

  /**
   * Opens the page for creating a new record.
   * After saving, the Return button enables the user to return to the search page
   * @param object navigation attributes
   */
  newRecord(object: { type: string; searchRoute: string; searchParams: any; navRoute: string; navQuery: any }) {
    const navInfo = new Navigation(object);
    const navQueryStr = this.initNavigation(navInfo);
    this.router.navigate([`${navInfo.navRoute}/create`], {
      queryParams: { query: navQueryStr },
    });
  }

  /**
   * Initialises the new navigation in the navigations map
   * @param navInfo the attributes of the navigation
   * @returns query (key) of this navigation in the map
   */
  initNavigation(navInfo: Navigation): string {
    if (!this.navigations[navInfo.navRoute]) {
      this.navigations[navInfo.navRoute] = {};
    }
    const navQueryStr = encodeURIComponent(JSON.stringify(navInfo.navQuery));
    this.navigations[navInfo.navRoute][navQueryStr] = navInfo;
    return navQueryStr;
  }

  /**
   * Returns to search results or parent detail
   */
  returnToList(navRoute: string, navQuery: string) {
    const navInfo = this.getNavInfo(navRoute, navQuery);
    this.router.navigate([`/${navInfo?.searchRoute}`], {
      queryParams: navInfo?.searchParams,
    });
  }

  /**
   * Tests if the current record has been selected from a list
   * @returns <code>true</code> if the current record has a list navigation info
   */
  public showReturn(navRoute: string, navQuery: string): boolean {
    return this.navigations[navRoute] && this.navigations[navRoute][navQuery];
  }

  /**
   * Tests if there are more records to browse
   * @param index of the current record
   * @returns true if the current record is part of a list and its not the last item of the list
   */
  public showNext(index: number, navRoute: string, query: any): boolean {
    const navInfo = this.getNavInfo(navRoute, query);
    if (!navInfo || !navInfo.list) {
      return false;
    }
    return index < navInfo.list.length - 1 || navInfo.list.length < navInfo.listCount;
  }

  /**
   * Tests if it's possible to browse backwards in the list
   * @param id of the current record
   * @param navRoute route of the current record
   * @param navQuery query for the current list
   * @returns true if the record is in a list and its not the first item of the list
   */
  public showPrevious(index: number, navRoute: string, navQuery: any): boolean {
    const navInfo = this.getNavInfo(navRoute, navQuery);
    if (!navInfo || !navInfo.list) {
      return false;
    }
    return index > 0;
  }

  /**
   * Go to the next record in the list
   * @param index of the current record
   */
  selectNext(index: number, navRoute: string, navQuery: string) {
    const navInfo = this.getNavInfo(navRoute, navQuery);
    if (navInfo && index === navInfo.list.length - 1) {
      // Last record of the list -> Load more
      this.loading['next'] = true;
      this.loadMore(navInfo).subscribe(() => {
        this.loading['next'] = false;
        // Navigate when the data has been loaded
        this.router.navigate([`/${navInfo.navRoute}/${navInfo.list[index + 1]}`], { queryParams: { query: navQuery, index: index + 1 } });
      });
    } else {
      // Navigate directly
      this.router.navigate([`/${navInfo?.navRoute}/${navInfo?.list[index + 1]}`], { queryParams: { query: navQuery, index: index + 1 } });
    }
  }

  /**
   * Go to the previous record on the list
   */
  selectPrevious(index: number, navRoute: string, navQuery: any) {
    const navInfo = this.getNavInfo(navRoute, navQuery);
    this.router.navigate([`/${navRoute}/${navInfo?.list[index - 1]}`], {
      queryParams: { query: navQuery, index: index - 1 },
    });
  }

  /**
   *
   * @returns navigation info for the current record
   */
  public getNavInfo(navRoute: string, navQuery: string): Navigation | null {
    if (!this.navigations[navRoute]) {
      return null;
    }
    return this.navigations[navRoute][navQuery];
  }

  /**
   * Loads more data and adds them to the list
   * @param navInfo the navigation info with the search criteria and sort info
   * @returns observable object with true if the data was loaded with success
   */
  protected loadMore(navInfo: Navigation): Observable<boolean> {
    const range = `${navInfo.list.length + 1}-${navInfo.list.length + this.maxRows}`;
    return this.object.getList(navInfo.type, navInfo.navQuery, navInfo.navSort, range).pipe(
      map((result) => {
        for (const id of result.ids) {
          navInfo.list.push(id);
        }

        // Later, when returning to the list, load the new range
        this.refreshRange(navInfo);

        return true;
      }, catchError(this.handleError('loadMore')))
    );
  }

  /**
   * Updates the range parameter of the parent url
   * @param navInfo the navigation infos of the current list
   */
  protected refreshRange(navInfo: Navigation) {
    if (!navInfo.searchParams['rows']) {
      navInfo.searchParams['rows'] = navInfo.list.length;
      return;
    }
    const rows = JSON.parse(decodeURIComponent(navInfo.searchParams['rows']));

    // Standard case
    if (typeof rows === 'string' || typeof rows === 'number') {
      navInfo.searchParams['rows'] = navInfo.list.length;
      return;
    }

    // Multi-list page
    rows[navInfo.type] = navInfo.list.length;
    navInfo.searchParams['rows'] = encodeURIComponent(JSON.stringify(rows));
  }
}
