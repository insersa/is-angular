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

import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

import { Mode } from '../../pages/object-detail/object-detail.component';

/**
 * A part of a detail object component.
 * The form is managed by the parent component, if the form isn't the direct parent element it must be provided
 * (https://www.youtube.com/watch?v=CD_t3m2WMM8&feature=youtu.be&t=25m23s) adding in the component decorator:
 * <code>viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],</code>
 */
@Component({
  selector: 'is-object-part',
  templateUrl: './object-part.component.html',
  styleUrls: ['./object-part.component.scss'],
})
export class ObjectPartComponent implements OnInit, AfterViewInit {
  /**
   * The record, to be added as @Input() in the
   */
  @Input() public record: any = {};

  /**
   * The id of the record.
   */
  @Input() public id: number;

  /**
   * Fields information (read-only, requires, ...).
   */
  @Input() public fieldInfo: any = {};

  /**
   * The mode of the detail part component.
   */
  @Input() public mode = Mode.Consult;

  /**
   * <code>true</code> to indicate if the form is beeing submitted, to show the validation errors.
   */
  @Input() public submitted: boolean;

  /**
   * <code>true</code> a line is being edited.
   */
  @Input() public working = false;

  /**
   * Emit an event when a line working change.
   */
  @Output() public workingChange = new EventEmitter<string[]>();

  /**
   * Event emitter to save the edit of some fields from the parent object detail component.
   */
  @Output() public save = new EventEmitter<string[]>();

  /**
   * Event emitter to cancel the edit of some fields from the parent object detail component.
   */
  /* eslint-disable @angular-eslint/no-output-native */
  @Output() public cancel = new EventEmitter<string[]>();

  /**
   * List of all input controls of this component.
   * Must be initialized by the subclass using <code>@ViewChildren(NgModel) protected controls: QueryList<NgModel>;</code>
   */
  protected controls: QueryList<NgModel>;

  /**
   * Constructor.
   * @param form the parent component form
   */
  constructor(protected form: NgForm) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.controls) {
      return;
    }

    // Add the controls to the parent component form to allow validation on the creation mode
    this.controls.forEach((control: NgModel) => {
      this.form.addControl(control);
    });
  }

  /**
   * To update some fields.
   * @param fields the field array to update
   */
  public onUpdateFields(fields: string[]): void {
    this.save.emit(fields);
  }

  /**
   * To cancel the edition of some fields.
   * @param fields the field array to cancel the edition
   */
  public onCancelFields(fields: string[]): void {
    this.cancel.emit(fields);
  }

  /**
   * To change the working flag.
   * @param event the event
   */
  public onWorkingChange(event: any): void {
    this.workingChange.emit(event);
  }

  /**
   * Flag to cechk if the creation mode.
   */
  public get create(): boolean {
    return this.mode === Mode.Create || this.mode === Mode.CreateMore;
  }

  /**
   * Flag to check the creation mode with more objects to be added.
   */
  public get createMore(): boolean {
    return this.mode === Mode.CreateMore;
  }

  /**
   * Set the mode to add more objects.
   * @param _value <code>true</code> if more objects will be added
   */
  public set createMore(_value: boolean) {
    if (this.mode === Mode.Create || this.mode === Mode.CreateMore) {
      this.mode = Mode.CreateMore;
    }
  }

  /**
   * <code>true</code> if the object must be readonly.
   */
  public get readonly(): boolean {
    return this.mode === Mode.Consult || this.mode === Mode.Delete;
  }
}
