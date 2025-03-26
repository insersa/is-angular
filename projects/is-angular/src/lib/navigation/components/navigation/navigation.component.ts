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

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Navigation } from '../../models/navigation.model';
import { NavigationService } from '../../services/navigation.service';
/**
 * Component with buttons Return to list, next and previous. To be used in object detail pages
 *
 * For a different html template, consider extending this component
 */
@Component({
  selector: 'is-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  /** Translate key for button "Return" */
  @Input() returnButtonKey = 'button.return.list';
  /** Translate key for button "Previous" */
  @Input() previousButtonKey = 'button.previous.record';
  /** Translate key for button "Next" */
  @Input() nextButtonKey = 'button.next.record';
  /** Class for the container div that holds the buttons  */
  @Input() containerClass = 'mt-4 mb-2';

  public showReturn = false;
  public showNext = false;
  public showPrevious = false;

  /** Name of the object detail route */
  private routeName: string;
  /** Query that allows for identifying the list that the object detail is part of */
  private query: string;
  /** Row number of the object detail in the list */
  private index: number;

  constructor(private route: ActivatedRoute, private navigation: NavigationService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.initRouteParams(params);
    });
  }

  private initRouteParams(queryParams: any) {
    if (!this.route.snapshot.url[0]) {
      return;
    }
    this.routeName = this.route.snapshot.url[0].path;
    this.query = this.route.snapshot.queryParams['query'];
    this.index = +queryParams['index'];
    this.showReturn = this.navigation.showReturn(this.routeName, this.query);
    this.showPrevious = this.navigation.showPrevious(this.index, this.routeName, this.query);
    this.showNext = this.navigation.showNext(this.index, this.routeName, this.query);
  }

  /**
   * Return to list
   */
  onReturn() {
    this.navigation.returnToList(this.routeName, this.query);
  }

  onPrevious() {
    this.navigation.selectPrevious(this.index, this.routeName, this.query);
  }

  onNext() {
    this.navigation.selectNext(this.index, this.routeName, this.query);
  }

  /**
   * @return navigation info for the current record
   * Used to determine the parent: a search page or a parent business object page
   */
  get navInfo(): Navigation | null {
    return this.navigation.getNavInfo(this.routeName, this.query);
  }
}
