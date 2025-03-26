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

import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

/**
 * A subset of fields in a search form, for example a set of fields that are reused in many search pages
 *
 */
@Component({
  selector: 'is-objects-search-part',
  templateUrl: './objects-search-part.component.html',
  styleUrls: ['./objects-search-part.component.scss'],
})
export class ObjectsSearchPartComponent implements OnInit, AfterViewInit {
  /** The search criteria of the parent form */
  @Input() public query: any = {};
  /** True if the form has been submitted */
  @Input() submitted = false;
  /** Flag for opening anf closing the panel, if the subset of fields is inside one, for example a collapse panel  */
  @Input() open = true;

  /**
   * List of all input controls of this component
   */
  @ViewChildren(NgModel) controls: QueryList<NgModel>;

  constructor(protected form: NgForm) {}

  ngOnInit() {}

  /**
   * Register the input components of this sub component in the parent form,
   * so that they will be included in form validation
   *
   * http://stackoverflow.com/questions/42352680/angular2-template-driven-sub-form-component-with-validation
   */
  ngAfterViewInit() {
    this.controls.forEach((control: NgModel) => {
      this.form.addControl(control);
    });
  }
}
