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

import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
/**
 * Scroll to the top button component.
 * Inspired by https://waterlooblue.com/scroll-to-top-with-angular-4-using-hostlistener/.
 */
@Component({
  selector: 'is-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit {
  /**
   * <code>true</code> if the scroll to the top button must be visible.
   */
  public showButton: boolean;

  /**
   * Constructor.
   * <code>@Inject(DOCUMENT) private document: any</code> instead of
   * <code>@Inject(DOCUMENT) private document: Document</code> while not supported by library AOT strictMetadataEmit=true:
   * https://github.com/angular/angular/issues/20351 and https://github.com/Nolanus/ngx-page-scroll/issues/35#issuecomment-250939092
   *
   * @param document the document
   */
  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit() {}

  /**
   * Host event listener to retrieve the scroll event and show/hide the scroll to the top button.
   */
  @HostListener('window:scroll', [])
  public onWindowScroll(): void {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.showButton = true;
    } else if ((this.showButton && window.pageYOffset) || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.showButton = false;
    }
  }

  /**
   * Scroll to the top of the current document.
   */
  public scrollToTop(): void {
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - currentScroll / 5);
      }
    })();
  }
}
