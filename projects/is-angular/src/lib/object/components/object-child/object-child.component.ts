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

import { ChangeDetectorRef, EventEmitter, Input, OnDestroy, OnInit, AfterViewInit, Output, ViewChild, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { MessageService } from '../../../error/services/message.service';
import { Tools } from '../../../util/tools';
import { Mode } from '../../pages/object-detail/object-detail.component';
import { ObjectFieldsService } from '../../services/object-fields.service';
import { ObjectService } from '../../services/object.service';

/**
 * Composant enfant embriqué dans le composant détail du parent
 */
@Component({
  selector: 'is-object-child',
  templateUrl: './object-child.component.html',
  styleUrls: ['./object-child.component.scss'],
})
export class ObjectChildComponent implements OnInit, OnDestroy, AfterViewInit {
  /** The index of the child record, if the parent component iterates over its children */
  @Input() index = 0;
  /** The child record */
  @Input() public record: any = {};
  /** The mode of the detail component. */
  @Input() public mode: Mode = Mode.Consult;
  /** <code>true</code> si le formulaire parent a été soumis */
  @Input() public submitted: boolean;
  /** <code>true</code> if a row is editing */
  @Input() public working = false;
  /** <code>true</code> if the component is a page */
  @Input() page = true;
  /** The id of the element to scroll on after a submit with validation error if the component in not a page. */
  @Input() public scrollElementId = 'messages';

  /** Evénement de début ou fin d'édition */
  @Output() workingChange = new EventEmitter<boolean>();
  /** Evénement output suppression */
  @Output() protected delete = new EventEmitter();
  /** Evénement "enregistrement sauvegardé" */
  @Output() protected saved = new EventEmitter();

  public fieldInfo: any = {};
  /** Affichage de boutons */
  public rendered: any = {
    edit: false,
    delete: false,
    save: false,
    cancel: false,
  };
  /** Nom du champ id*/
  protected idField: string;
  /** Nom du champ 'date de mise à jour' */
  protected updateDateField: any;
  /** Nom de l'objet métier */
  protected objectName: string;

  /**
   * <code>true</code> to load the children, <code>false</code> to load only the main object.
   */
  public includeChildren = false;
  /** Instance of the child form in the HTML template */
  @ViewChild(NgForm) protected childForm: NgForm;

  /** Actions en cours */
  public loading = { save: false };

  constructor(
    protected translate: TranslateService,
    protected form: NgForm,
    protected object: ObjectService,
    protected objectFields: ObjectFieldsService,
    protected cdr: ChangeDetectorRef,
    protected logger: NGXLogger,
    protected messages: MessageService
  ) {}

  ngOnInit() {
    if (this.create || (!this.readonly && !this.record[this.idField])) {
      this.rendered['delete'] = true;
    }

    // Ajout en mode consultation/édition
    if (!this.readonly && !this.create && this.record[this.idField] === undefined) {
      this.rendered['save'] = true;
    }
    this.objectFields.getFieldInfo(this.objectName).subscribe((info: any) => {
      this.fieldInfo = info;
      // Pour résoudre "Expression has changed after it was checked" dans les composants input qui sont "required"
      this.cdr.detectChanges();
    });
  }

  /**
   * Register the input components of this child component in the parent form,
   * so that they will be included in form validation
   *
   * https://github.com/angular/angular/issues/9600
   * https://plnkr.co/edit/Jipw4AVNbdXqflfBNKMY?p=preview
   */
  ngAfterViewInit() {
    this.form.form.registerControl(`${this.objectName}_form_${this.index}`, this.childForm.form);
  }

  ngOnDestroy() {}

  /**
   * Action de suppression
   */
  onDelete(): void {
    this.delete.emit(null);
  }

  /**
   * Action d'édition
   */
  onEdit(): void {
    this.mode = Mode.Edit;
    this.rendered['edit'] = false;
    this.rendered['delete'] = false;
    this.rendered['save'] = true;
    this.rendered['cancel'] = true;
    this.working = true;
    this.workingChange.emit(true);
  }

  /**
   * Action de sauvegarde
   */
  onSave(): void {
    this.messages.clear();
    this.submitted = true;
    this.loading.save = true;

    this.checkValidity()
      .pipe(
        mergeMap((valid: boolean) => {
          if (!valid) {
            return of({ valid: false });
          }
          // update record
          return this.object.submit(this.record[this.idField], this.objectName, this.record);
        })
      )
      .subscribe((result: any) => {
        this.loading.save = false;
        if (result['valid'] !== undefined && !result['valid']) {
          Tools.scrollToTop(this.page, this.scrollElementId);
          return;
        }
        if (!result['status']) {
          if (result['record']) {
            this.record = result['record'];
          }
          this.initConsult();
          this.saved.emit(this.record);
        } else if (result['status'] === 304) {
          // Nothing changed
          this.initConsult();
        }
      });
  }

  /**
   * Update the specified fields.
   * @param fields the array of fields to update
   */
  public onUpdateFields(fields: string[]) {
    this.messages.clear();
    const patch = [];
    for (const field of fields) {
      patch.push({
        op: 'replace',
        path: field,
        value: this.record[field],
        date: this.record[this.updateDateField],
      });
    }
    this.object.updateFields(this.objectName, this.record[this.idField], patch).subscribe((result) => {
      if (result['record']) {
        this.record = result['record'];
        this.working = false;
        this.workingChange.emit(false);
        this.initConsult();
        this.saved.emit();
      } else {
        // Error
        if (result['status'] !== 304) {
          this.logger.error(
            'ObjectChildl.onUpdateFields. Id:',
            this.record[this.idField],
            'Fields:',
            fields,
            'Type: ',
            this.objectName,
            'Error: ',
            result['status']
          );
          this.onCancelFields(fields);
        } else {
          this.working = false;
        }
      }
    });
  }

  /**
   * Cancel the update of the specified fields.
   * @param fields the array of fields to cancel the update
   */
  public onCancelFields(fields: string[]) {
    this.messages.clear();
    this.object.getRecord(this.record[this.idField], this.objectName, this.includeChildren).subscribe((result) => {
      if (result['record']) {
        const record = result['record'];
        for (const field of fields) {
          this.record[field] = record[field];
        }
        this.initConsultFields(fields);
        this.working = false;
        this.workingChange.emit(false);
        return;
      }
    });
  }

  /**
   * Initialize the specified fields after an update cancel.
   * @param _fields the array of fields
   */
  protected initConsultFields(_fields: string[]) {
    // A implémenter dans le composant métier si besoin
  }

  /**
   * Vérification du formulaire enfant embriqué
   * Possible de surcharger pour des contrôles supplémentaires sur un objet métier.
   * @returns true si le formulaire est valide
   */
  protected checkValidity(): Observable<boolean> {
    if (!this.childForm.valid) {
      this.messages.add('error', 'message.validation.error');
    }
    return of(this.childForm.valid ? this.childForm.valid : false);
  }

  /**
   * Action d'annulation d'édition
   */
  onCancel(): void {
    this.messages.clear();
    // Get record
    this.object.getRecord(this.record[this.idField], this.objectName).subscribe((res: any) => {
      if (res.record) {
        this.record = res.record;
        this.initConsult();
      }
    });
  }

  protected initConsult(): void {
    this.rendered['save'] = false;
    this.rendered['cancel'] = false;
    this.rendered['delete'] = false;
    this.mode = Mode.Consult;
    this.submitted = false;
    this.working = false;
    this.workingChange.emit(false);
  }

  /**
   * Flag to cechk if the creation mode.
   */
  public get create(): boolean {
    return this.mode === Mode.Create || this.mode === Mode.CreateMore;
  }

  /**
   * Set the mode to add an object.
   * @param value value <code>true</code> if an object will be added
   */
  @Input() public set create(value: boolean) {
    this.mode = value ? Mode.Create : Mode.Consult;
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
    return this.record[this.idField] && (this.mode === Mode.Consult || this.mode === Mode.Delete);
  }

  /**
   * To change the working flag.
   * @param event the event
   */
  public onWorkingChange(event: any): void {
    this.workingChange.emit(event);
  }
}
