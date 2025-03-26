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

import { OnInit, OnDestroy, ChangeDetectorRef, Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Observable, of, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { MessageService } from '../../../error/services/message.service';
import {
  ChildNavigations,
  Children,
  DeleteResponse,
  FieldInfo,
  RecordResponse,
  ValueObject,
} from '../../../models/interfaces/object.interface';
import { NavigationService } from '../../../navigation/services/navigation.service';
import { User } from '../../../user/classes/user.model';
import { UserService } from '../../../user/services/user.service';
import { Tools } from '../../../util/tools';
import { ObjectFieldsService } from '../../services/object-fields.service';
import { ObjectInitService } from '../../services/object-init.service';
import { ObjectService } from '../../services/object.service';

/**
 * The mode of a detail component.
 */
export enum Mode {
  /**
   * The consultation mode.
   */
  Consult,
  /**
   * The normal creation mode.
   */
  Create,
  /**
   * The special creation mode to add more objects after the current one.
   */
  CreateMore,
  /**
   * The edition mode.
   */
  Edit,
  /**
   * The delete mode.
   */
  Delete,
}

@Component({
  selector: 'is-object-detail',
  templateUrl: './object-detail.component.html',
  styleUrls: ['./object-detail.component.scss'],
})
export class ObjectDetailComponent implements OnInit, OnDestroy {
  /** Nom de l'objet métier au niveau routing */
  public routeName: string;
  /** Nom de l'objet métier selon configuration */
  protected type: string;
  /** Nom du champ 'date de mise à jour' */
  protected updateDateField: string;

  /** Flag pour afficher le form. Utilisé pour faire un reset des propriétés touched, dirty, etc. */
  public show = true;
  /** Flag pour indiquer si un sauvegarde a commencé. Utilisé pour afficher des erreurs de validation. */
  public submitted = false;
  /** L'enregistrement */
  public record: ValueObject = {};
  /** Id de l'enregistrement */
  public id: number | undefined;

  /**
   * The mode of the detail component.
   */
  public mode: Mode = Mode.Consult;

  /**
   * <code>true</code> to load the children, <code>false</code> to load only the main object.
   */
  public includeChildren = true;

  /** Infos sur les champs: readonly, required etc. */
  public fieldInfo: { [key: string]: FieldInfo } = {};
  /** Edition d'une ligne en cours */
  public working = false;
  /** Flag pour indiquer s'il y a une pages précédente. Dans ce cas, activer le bouton/lien
   * "Retour" (à la liste ou au détail du parent) */
  public isHistory = false;
  /** Flag pour indiquer que la pages précédente était création. Important pour le bouton "Retour à la liste" */
  protected isCreateHistory = false;
  /** Flag pour afficher message 'Enregistré avec succès' */
  protected submitOK = false;
  /** Changement d'utilisateur ou d'infos d'utilisateur */
  private userChangeSubscription: Subscription | undefined;
  /** Changement de paramètre dans la route */
  private routeParamsSubscription: Subscription | undefined;
  /** Actions en cours */
  public loading = { save: false, delete: false, cancel: false };

  /**
   * Infos à initialiser dans l'objet métier pour naviguer sur les enfants: la route et une clé unique pour le childrenlist
   * en forme de query
   *
   * Child name -> {route: string, query: {parent_id_field: this.id, type: childType}, idField: childIdField}
   *
   * */
  protected childNavs: ChildNavigations = {};

  /** Flag pour mettre mode Edit par défaut (au lieu de mode Consult) */
  protected defaultEdit = false;

  /**
   * <code>true</code> if the component is a page.
   */
  @Input() public page = true;

  /**
   * The id of the element to scroll on after a submit if the component in not a page.
   */
  @Input() public scrollElementId = 'messages';

  /** Evénements de création dans un popup */
  @Output() protected created: EventEmitter<unknown>; // created = new EventEmitter<any>(); // To avoid warnings in WebStorm when the class is extended
  @Output() protected cancelCreate: EventEmitter<unknown>; // cancelCreate = new EventEmitter(); // To avoid warnings in WebStorm when the class is extended

  /** Le formulaire Angular imbriqué dans le HTML */
  @ViewChild(NgForm) public form: NgForm;

  constructor(
    public translate: TranslateService,
    public router: Router,
    protected route: ActivatedRoute,
    public user: UserService,
    protected logger: NGXLogger,
    protected object: ObjectService,
    protected objectFields: ObjectFieldsService,
    protected objectInit: ObjectInitService,
    protected cdr: ChangeDetectorRef,
    public messages: MessageService,
    protected navigation: NavigationService
  ) {}

  ngOnInit() {
    if (history.length > 1) {
      this.isHistory = true;
    }

    // Initialize the route event only if the component is at the page level
    if (this.page) {
      this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
        this.initRouteParams(params);
        window.scroll(0, 0);
      });
    } else if (this.mode === Mode.Consult) {
      this.initInputParams();
    }

    // Initialize the usere event
    this.userChangeSubscription = this.user.onUserChange.subscribe((user: User) => this.updateUser(user));

    // Initialize the field infos
    this.objectFields.getFieldInfo(this.type).subscribe((info: { [key: string]: FieldInfo }) => {
      this.fieldInfo = info;
      this.cdr.detectChanges();
    });

    // Initialize the creation if needed
    if (this.create) {
      this.initCreate();
    }
  }

  ngOnDestroy() {
    // Unsubscribe from events
    if (this.page) {
      this.routeParamsSubscription?.unsubscribe();
    }
    this.userChangeSubscription?.unsubscribe();
  }

  /**
   * Action retourner à la pages précédente
   *
   * Si le détail est ouvert dans une nouvelle pages, p.ex. par accès d'une application JSF,
   * il n'y a pas de "pages précédente" -> history.length = 1
   *
   * Si un nouvel enregistrement vient d'être créé la pages précédente est le formulaire de création.
   * Il faut réculer deux pas pour retourner à la liste.
   */
  onBack() {
    if (history.length > 1) {
      if (this.isCreateHistory) {
        history.go(-2);
        return;
      }
      history.back();
    }
  }

  /** Passage de mode consultation à mode édition */
  onEdit() {
    this.mode = Mode.Edit;
  }

  /**
   * Annulation d'édition
   */
  public onCancelEdit() {
    this.messages.clear();
    this.loading.cancel = true;
    this.refreshRecord().subscribe(() => {
      this.initConsult();
      this.loading.cancel = false;
    });
  }

  /**
   * Sauvegarde d'un objet enfant
   */
  onSavedChild() {
    this.refreshRecord().subscribe(() => {
      this.initConsult();
    });
  }

  onDelete(): void {
    if (!this.id) {
      return;
    }
    this.loading.delete = true;
    this.object.delete(this.id, this.type, this.record).subscribe((result: DeleteResponse) => {
      this.loading.delete = false;
      if (result.status) {
        // Il y a un message d'erreur
        Tools.scrollToTop(this.page, this.scrollElementId);
        this.afterDelete();
        return;
      }
      const query = this.route.snapshot.queryParams['query'];
      if (this.navigation.showReturn(this.routeName, query)) {
        this.navigation.returnToList(this.routeName, query);
      } else {
        this.afterDelete();
        this.onBack();
      }
    });
  }

  /**
   * Action à faire après la suppression, p.ex. fermer le popup de confirmation de suppression
   */
  protected afterDelete(): void {
    // A implémenter dans la classe métier selon besoin
  }

  /**
   * Submit a whole form
   */
  onSubmit() {
    this.messages.clear();
    this.submitted = true;
    this.loading.save = true;

    this.checkValidity()
      .pipe(
        mergeMap((valid: boolean) => {
          if (!valid) {
            return of({ valid: false });
          }
          return this.object.submit(this.id, this.type, this.record);
        })
      )
      .subscribe((result: RecordResponse) => {
        this.loading.save = false;
        this.afterSubmit(result);
        Tools.scrollToTop(this.page, this.scrollElementId);
      });
  }

  /**
   * Traitement de résultat d'un submit (création ou mise à jour)
   * @param result le résultat de submit
   */
  protected afterSubmit(result: RecordResponse) {
    if (result.id) {
      this.afterCreate(result);
    } else if (result.record) {
      // Rafraichissements après une mise à jour
      this.record = result.record;
      this.initConsult();
      this.submitOK = true;
      this.showSubmitSuccess();
    } else if (result.status === 304) {
      // Rien modifié
      this.mode = Mode.Consult;
    }
    // Else error: do nothing
  }

  /**
   * Initialisations après un soumission d'un nouvel enregistrement
   * @param result réponse json du object service submit
   */
  protected afterCreate(result: RecordResponse) {
    if (this.page) {
      if (!this.createMore) {
        // Consulter l'enregistrement créé
        this.submitOK = true;
        const params = Tools.clone(this.route.snapshot.queryParams);
        if (!this.isHistory) {
          params['history'] = false;
        } else {
          params['created'] = true;
        }
        this.router.navigate([`${this.routeName}/${result.id}`], {
          queryParams: params,
        });
      } else {
        // Créer un enregistrement supplémentaire
        this.initCreate();
        this.showSubmitSuccess();
      }
    } else {
      this.messages.clear();
      this.created.emit(result.record);
    }
  }

  /**
   * Méthode de vérification du formulaire.
   * Possible de surcharger pour des contrôles supplémentaires sur un objet métier.
   * @returns true si le formulaire est valide
   */
  protected checkValidity(): Observable<boolean> {
    if (!this.form.valid) {
      this.messages.add('error', 'message.validation.error');
    }
    return of(this.form.valid ? this.form.valid : false);
  }

  /**
   * Met à jour une liste de champs
   * @param fields noms des champs
   */
  onUpdateFields(fields: string[]) {
    if (!this.id) {
      return;
    }
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
    this.object.updateFields(this.type, this.id, patch).subscribe((result) => {
      if (result['record']) {
        this.record = result['record'];
        this.working = false;
        this.initConsult();
      } else {
        if (!result['status']) {
          // The update was successful, but the record is no longer available, for example due to backend business
          // rules that delete it automatically
          this.onBack();
        } else if (result['status'] === 304) {
          // Nothing changed
          this.working = false;
        } else {
          // Error
          this.logger.error(
            'ObjectDetail.onUpdateFields. ' + 'Id:',
            this.id,
            'Fields:',
            fields,
            'Type: ',
            this.type,
            ' Erreur: ',
            result['status']
          );
          this.onCancelFields(fields);
        }
      }
    });
  }

  /**
   * Annule la modification d'une ligne de champs. Rafraichi uniquement les champs modifié, pas l'enregistrement complêt
   * @param fields noms des champs
   */
  onCancelFields(fields: string[]) {
    if (!this.id) {
      return;
    }
    this.object.getRecord(this.id, this.type, this.includeChildren).subscribe((result) => {
      if (result['record']) {
        const record = result['record'];
        for (const field of fields) {
          this.record[field] = record[field];
        }
        this.initConsultFields(fields);
      }
      this.working = false;
    });
  }

  /**
   * Action d'annulation de création d'un nouvel enregistrement
   */
  onCancelCreate() {
    if (this.page) {
      if (this.isHistory) {
        this.onBack();
      } else {
        // Cas Nouvelle pages (p.ex. entrée par JSF)
        window.close();
      }
    } else {
      this.messages.clear();
      this.cancelCreate.emit();
    }
  }

  /**
   * Rafraichi l'enregistrement
   * @return null
   */
  public refreshRecord(): Observable<null> {
    if (this.id !== undefined) {
      return this.object.getRecord(this.id, this.type, this.includeChildren).pipe(
        map((res: any) => {
          this.record = res.record;
          return null;
        })
      );
    } else {
      return of(null);
    }
  }

  /** Initialise le composant à la base des paramètres de input, p.ex. mode consultation dans popup */
  protected initInputParams(): void {
    if (this.mode === Mode.Consult && this.id) {
      this.refreshRecord().subscribe(() => {
        if (Object.keys(this.record).length > 0) {
          this.initConsult();
          if (this.defaultEdit && this.user.currentUser?.isAuthAction(this.type, 'PUT')) {
            this.onEdit();
          }
        } else {
          this.messages.add('error', 'message.general.error');
        }
      });
    }
  }

  /**
   * Initialise le composant à la base des paramètres de route, ex. mode, id
   */
  protected initRouteParams(params: any) {
    this.messages.clear();
    const id = params['id'];
    if (id) {
      // Mode consultation et édition
      this.id = +id;

      if (this.route.snapshot.queryParams) {
        this.isCreateHistory = this.route.snapshot.queryParams['created'];
        if (this.route.snapshot.queryParams['history'] !== undefined) {
          this.isHistory = this.route.snapshot.queryParams['history'] === 'true';
        }
      }

      this.refreshRecord().subscribe(() => {
        if (Object.keys(this.record).length > 0) {
          this.initConsult();
          if (this.defaultEdit && this.user.currentUser?.isAuthAction(this.type, 'PUT')) {
            this.onEdit();
          }
          this.showSubmitSuccess();
        } else {
          this.messages.add('error', 'message.general.error');
        }
      });
      return;
    }
    // Mode create
    this.initCreate();
  }

  /**
   * Initialise des propriétés pour le mode consultation
   * A sucharger si besoin d'initialisations supplémentaires
   */
  protected initConsult() {
    this.submitted = false;
    this.mode = Mode.Consult;
  }

  /**
   * Initialise des propriétés pour une liste de champs donnés en mode consultation
   * suite à une annulation d'édition
   * @param fields noms de champs
   */
  protected initConsultFields(_fields: string[]) {
    // A implémenter dans le composant métier si besoin
  }

  /**
   * Initialise un formulaire vierge. Le timeout force le NgForm à faire un reset de ses composants.
   *
   * Les valeurs initiales sont injectés après le reset! Il faut s'assurer que tous les éléments
   * du formulaire sont affiché et prêts pour la customisation, ex. le zoom d'une carte selon attributs d'un utilisateur
   */
  protected initCreate() {
    this.show = false;
    this.id = undefined;
    this.submitted = false;
    this.record = {};
    this.mode = Mode.Create;
    setTimeout(() => {
      this.show = true;
      // Init de valeurs
      this.initCreateObject().subscribe((initObject: any) => {
        this.record = initObject;
        this.updateUser(this.user.currentUser);
      });
    }, 0);
  }

  /**
   * Update the component for a given user.
   *
   */
  protected updateUser(_user: User | undefined) {
    // Des propriétés à initialiser quand les propriétés de l'utilisateur change
  }

  /**
   *
   * @returns objet initiale en mode création
   */
  protected initCreateObject(): Observable<any> {
    return this.objectInit.getInitObject(this.type, 'create').pipe(
      map((result: any) => {
        return Tools.clone(result['record']);
      })
    );
  }

  protected showSubmitSuccess() {
    if (this.create || this.submitOK) {
      this.messages.add('success', 'message.submit.success');
      this.submitOK = false;
    }
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
   * @param value <code>true</code> if more objects will be added
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

  /**
   * Sélection d'un enfant pour consultation
   * @param type name of childrenlist
   * @param index index of the child record
   */
  onSelectChild(type: string, index: number) {
    const navInfo = {
      index: index,
      type: type,
      parentType: this.type,
      parentMode: Mode.Consult,
      searchRoute: `${this.route.snapshot.url[0].path}/${this.id}`,
      searchParams: this.route.snapshot.queryParams,
      navRoute: this.childNavs[type]['route'],
      navQuery: this.childNavs[type]['query'],
      navSort: <any>undefined,
      list: this.getIds(type),
      listCount: (this.record['children'] as Children)[type].length,
    };
    this.navigation.selectRecord(navInfo);
  }

  /**
   *
   * @param type name of childrenlist
   * @returns list of ids
   */
  private getIds(type: string): number[] {
    const list = (this.record['children'] as Children)[type];
    const ids: number[] = [];
    for (const record of list) {
      ids.push(record[this.childNavs[type]['idField']] as number);
    }
    return ids;
  }
}
