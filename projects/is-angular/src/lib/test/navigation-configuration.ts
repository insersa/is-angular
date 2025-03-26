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

import { Navigation } from '../navigation/models/navigation.model';
import { NavigationService } from '../navigation/services/navigation.service';

/*********************** Navigation service MOCK *************************/

@Injectable()
export class NavigationServiceMock {
  public selectRecord(_object: {
    index: number;
    type: string;
    searchRoute: string;
    searchParams: any;
    navRoute: string;
    navQuery?: any;
    navSort: any;
    list: number[];
    listCount: number;
  }) {
    return;
  }

  public newRecord(_object: { type: string; searchRoute: string; searchParams: any; navRoute: string; navQuery: any }) {
    return;
  }

  /**
   * Initialises the new navigation in the navigations map
   * @param navInfo the attributes of the navigation
   * @returns query (key) of this navigation in the map
   */
  initNavigation(_navInfo: Navigation): string {
    return '';
  }

  /**
   * Returns to search results or parent detail
   */
  returnToList(_navRoute: string, _navQuery: string) {
    return '';
  }

  /**
   * Tests if the current record has been selected from a list
   * @returns <code>true</code> if the current record has a list navigation info
   */
  public showReturn(_navRoute: string, _navQuery: string): boolean {
    return true;
  }

  /**
   * Tests if there are more records to browse
   * @param index of the current record
   * @returns true if the current record is part of a list and its not the last item of the list
   */
  public showNext(_index: number, _navRoute: string, _query: any): boolean {
    return true;
  }

  /**
   * Tests if it's possible to browse backwards in the list
   * @param id of the current record
   * @param navRoute route of the current record
   * @param navQuery query for the current list
   * @returns true if the record is in a list and its not the first item of the list
   */
  public showPrevious(_index: number, _navRoute: string, _navQuery: any): boolean {
    return true;
  }

  /**
   * Go to the next record in the list
   * @param index of the current record
   */
  selectNext(_index: number, _navRoute: string, _navQuery: string) {
    return;
  }

  /**
   * Go to the previous record on the list
   */
  public selectPrevious(_index: number, _navRoute: string, _navQuery: any) {
    return;
  }
}

/**
 * Configurer le stub pour le service
 *
 */
export function getNavigationServiceStubProvider(): any {
  return { provide: NavigationService, useClass: NavigationServiceMock };
}
