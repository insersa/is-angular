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

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

import { MessageService } from '../../../error/services/message.service';
import { Sort, ValueObject } from '../../../models/interfaces/object.interface';
import { PropertyService } from '../../../property/services/property.service';
import { User } from '../../../user/classes/user.model';
import { UserService } from '../../../user/services/user.service';
import { Tools } from '../../../util/tools';
import { ObjectInitService } from '../../services/object-init.service';
import { ObjectService } from '../../services/object.service';

@Component({
  selector: 'is-objects-search',
  templateUrl: './objects-search.component.html',
  styleUrls: ['./objects-search.component.scss'],
})
export class ObjectsSearchComponent implements OnInit, OnDestroy {
  /* Nom de l'objet métier */
  type: string;

  /* Formulaire de recherche à valider */
  form: NgForm;

  /* Flag pour afficher le formulaire ngForm. Utilisé pour faire des reset */
  show = true;

  /* Flag pour l'affichage de recherche simple/étendue.*/
  extendedSearch = false;

  /* La requête */
  extendedQuery: ValueObject = {};

  /* La requête simple */
  simpleQuery: ValueObject = {};

  /** Requête initiale donné par le backend pour la recherche simple et étendu (avec childrenmap) */
  initQuery: ValueObject = {};

  /* Le dernier tri */
  sort: Sort;

  /* Tri initale sans recherche */
  initSort: Sort;

  /* Flag pour afficher les messages d'erreur sur les champs au moment d'envoi de recherche */
  submitted = false;

  /* Nbr d'enregistrement chargés à la fois */
  maxRows: number;

  /**
   * The last row number to load.
   */
  endRow: number;

  /** True if initial data should be loaded */
  protected isInitialData = true;

  /* Evénements de recherche */
  @Output() data = new EventEmitter<any>(); // data = new EventEmitter<{records: any[], ids: number[]}>()
  @Output() moredata = new EventEmitter<any>(); // moredata = new EventEmitter<{records: any[], ids: number[]}>()
  @Output() datacount = new EventEmitter<number>();
  @Output() loading = new EventEmitter<any>();

  /**
   * Event emitter to indicate that a search has been done.
   * An event is emitted after each search.
   */
  @Output() searched = new EventEmitter<any>();

  /** Flag pour indiquer s'il s'agit d'un popup. Dans ce cas, pas de routing! */
  public popup = false;

  /** Noms de champs dans export csv */
  protected csvFields: string;

  /** Clés de libellés entête dans export csv */
  protected csvLabelKeys: string;

  /**
   * Changement d'information sur l'utilisateur
   */
  private userEvent: Subscription;
  /**
   * Changement de route params (evénement de navigation ou recherche)
   */
  private routeParamEvent: Subscription;

  /**
   * Constructor retrieving the query from the route's parameters.
   *
   * @param object the services to access to the object data
   * @param logger the logger
   * @param property the services to access to the properties
   * @param translate the translation services
   * @param router the router
   * @param route the active route
   * @param objectInit services pour initialiser la requête vierge depuis le backend
   * @param user services de gestion de l'utilisateur authentifié
   * @param messages service pour messages d'erreur/info/warn à l'utilisateur
   */
  constructor(
    public object: ObjectService,
    protected logger: NGXLogger,
    protected property: PropertyService,
    public translate: TranslateService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected objectInit: ObjectInitService,
    protected user: UserService,
    protected messages: MessageService
  ) {
    if (property.properties && property.properties['result.maxrows']) {
      this.maxRows = Number(property.properties['result.maxrows']);
    }
  }

  /**
   * Initialize the component sort and data.
   */
  ngOnInit() {
    this.endRow = this.maxRows;
    this.userEvent = this.user.onUserChange.subscribe((user: User) => this.updateUser(user));
    this.sort = this.initSort;

    if (this.popup) {
      return;
    }

    // Retrieve the query from the route's parameters
    this.routeParamEvent = this.route.queryParams.subscribe((params) => {
      this.initRouteSort(params);
      this.endRow = +params['rows'] || this.maxRows;
      const backNavSearch = this.initRouteQuery(params);

      if (!backNavSearch) {
        return;
      }

      if (this.extendedSearch) {
        this.search();
        return;
      }

      // If simple search by back navigation, init a new extended query from the backend (for later needs) before
      // executing the search
      this.objectInit.getInitObject(this.type, 'search').subscribe((result: any) => {
        if (result.record) {
          this.initQuery = result.record;
          this.search();
        }
      });
    });

    // If no query was defined the default data are initialized
    if (
      this.isInitialData &&
      this.route.snapshot.queryParams['simple'] === undefined &&
      this.route.snapshot.queryParams['extended'] === undefined
    ) {
      this.initData();
    }
  }

  /**
   * Initialise la clé et orientation de tri depuis les paramètres de la route
   * @param params paramètres de la route
   */
  private initRouteSort(params: any): void {
    if (params['sort'] !== undefined) {
      this.sort = JSON.parse(decodeURIComponent(params['sort'] || this.initSort));
    } else {
      this.sort = this.initSort;
    }
  }

  /**
   * Initialise la requête depuis les paramètres de la route
   * @param params paramètres de la route
   * @return true si la requête a changé et exige une nouvelle recherche (back navigation avec critères de recherche)
   */
  private initRouteQuery(params: any): boolean {
    let search = false;
    if (params['simple'] !== undefined) {
      search = this.initSimpleQuery(params);
    } else if (params['extended'] !== undefined) {
      search = this.initExtendedQuery(params);
    }
    return search;
  }

  /**
   * Initialise la requête simple depuis les paramètres de la route
   * @param params paramètres du URL
   */
  protected initSimpleQuery(params: any): boolean {
    // Get the query object from the simple query parameter
    this.extendedSearch = false;
    const query = JSON.parse(decodeURIComponent(params['simple'] || '{}'));
    this.logger.debug('ObjectsSearch.route.queryParams.subscribe: simple query from route params', query);
    this.logger.debug('Show form', this.show);
    const search = !Tools.deepEquals(this.simpleQuery, query, true);
    this.simpleQuery = query;
    return search;
  }

  /**
   * Initialise la requête étendue depuis les paramètres de la route
   * @param params paramètres du URL
   */
  protected initExtendedQuery(params: any): boolean {
    // Get the query object from the extended query parameter
    this.extendedSearch = true;
    const query = JSON.parse(decodeURIComponent(params['extended'] || '{}'));
    this.logger.debug('ObjectsSearch.route.queryParams.subscribe: extended query from route params', query);
    const search = !Tools.deepEquals(this.extendedQuery, query, true);
    this.extendedQuery = query;
    return search;
  }

  ngOnDestroy() {
    if (!this.popup) {
      if (this.userEvent) {
        this.userEvent.unsubscribe();
      }
      if (this.routeParamEvent) {
        this.routeParamEvent.unsubscribe();
      }
    }
  }

  /**
   * Update the component for a given user.
   *
   */
  protected updateUser(_user: User | undefined) {
    // Implémenter dans l'objet métier
  }

  onExtendedSearch() {
    this.extendedSearch = true;
  }

  /**
   * Recherche par evénement de tri
   * @param sort nom du champ
   */
  onSort(sort: any) {
    this.sort = sort;
    this.loading.emit({ list: true });

    // Popup => recherche directe sans navigation
    if (this.popup) {
      this.object.getList(this.type, this.getQuery(), this.sort, '1-' + this.endRow).subscribe((res: any) => {
        if (res.records) {
          this.data.emit({ records: res.records, ids: res.ids });
        }
        this.loading.emit({ list: false });
      });
      return;
    }

    // Page principale => navigation, puis recherche
    this.navigate().then((_) => {
      this.object.getList(this.type, this.getQuery(), this.sort, '1-' + this.endRow).subscribe((res: any) => {
        if (res.records) {
          this.data.emit({ records: res.records, ids: res.ids });
        }
        this.loading.emit({ list: false });
      });
    });
  }

  /**
   * Charger plus d'enregistrements dans la liste
   */
  onLoadMore() {
    // Popup => Recherche directe sans navigtion
    if (this.popup) {
      this.loading.emit({ list: true });
      this.loadData();
    } else {
      // Update the route and then load the new rows
      this.navigate().then((_) => {
        this.loading.emit({ list: true });
        this.loadData();
      });
    }
  }

  /**
   * Charger plus d'enregistrements dans la liste
   */
  private loadData(): void {
    // Calculate the range of rows to load
    const startRow = this.endRow + 1;
    this.endRow = this.endRow + this.maxRows;
    this.object.getList(this.type, this.getQuery(), this.sort, startRow + '-' + this.endRow).subscribe((res: any) => {
      if (res.records) {
        this.moredata.emit({ records: res.records, ids: res.ids });
      }
      this.loading.emit({ list: false });
    });
  }

  /**
   * Action call from the button "search"
   */
  onSearch() {
    // Restore the default values
    this.endRow = this.maxRows;

    if (this.popup) {
      this.search();
      return;
    }

    // Update the route and then execute the search
    this.navigate().then((_) => this.search());
  }

  /** Refresh the list without navigating, for example from a parent component */
  onRefresh() {
    this.search();
  }

  /**
   * Prepare the navigation query parameters (used by the this.navigate()). Can be overridden to add custom parameters.
   * @returns the navigation query parameters
   */
  protected navigateQueryParams(): any {
    const params: any = {};

    // Set the query param
    if (this.extendedSearch) {
      if (Object.keys(this.extendedQuery).length > 0) {
        params['extended'] = encodeURIComponent(JSON.stringify(this.extendedQuery));
      }
    } else {
      if (Object.keys(this.simpleQuery).length > 0) {
        params['simple'] = encodeURIComponent(JSON.stringify(this.simpleQuery));
      }
    }

    // Set the sort param
    if (!Tools.deepEquals(this.sort, this.initSort)) {
      params['sort'] = encodeURIComponent(JSON.stringify(this.sort));
    }

    // Set the row param
    if (this.endRow !== this.maxRows) {
      params['rows'] = this.endRow;
    }

    return params;
  }

  /**
   * Evénement d'export CSV
   */
  onExport(endrow?: number) {
    this.loading.emit({ csv: true });
    this.object
      .getCSV({
        type: this.type,
        query: this.getQuery(),
        sort: this.sort,
        range: endrow ? `1-${endrow}` : `1-${this.endRow}`,
        fields: this.csvFields,
        labelkeys: this.csvLabelKeys,
        language: this.translate.currentLang,
      })
      .subscribe((result: any) => {
        if (result instanceof Blob) {
          Tools.openDocument('list', this.type, <Blob>result, 'csv');
        }
        this.loading.emit({ csv: false });
      });
  }

  /**
   * Navigate to the search route including query, sort and rows  parameters.
   */
  private navigate(): Promise<boolean> {
    // Navigate to the route using the params
    return this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: this.navigateQueryParams(),
    });
  }

  /**
   * Execute the search from the button or from the pages loading.
   */
  protected search() {
    this.messages.clear();
    this.submitted = true;
    if (this.form !== undefined && !this.form.valid) {
      this.logger.info('ObjectsSearch.onSearch: Form invalide');
      this.messages.add('error', 'message.validation.error');
      return;
    }
    this.logger.debug('ObjectsSearch.onSearch: Query', this.getQuery());
    this.searched.emit(null);
    this.loading.emit({ list: true });
    this.datacount.emit(0);
    this.data.emit({ records: [], ids: [] });
    this.object.getListCount(this.type, this.getQuery()).subscribe((res: any) => {
      if (res.count) {
        this.datacount.emit(res.count);
      }
    });
    this.object.getList(this.type, this.getQuery(), this.sort, '1-' + this.endRow).subscribe((res: any) => {
      if (res.records) {
        this.data.emit({ records: res.records, ids: res.ids });
        this.afterData();
      }
      this.loading.emit({ list: false });
      this.submitted = false;
    });
    this.resetQuery();
  }

  /**
   * Charge des données initiale selon tri initiale
   */
  protected initData() {
    this.loading.emit({ list: true });

    // Cherche les critères de recherche initiales ("getInitVo")
    this.objectInit.getInitObject(this.type, 'search').subscribe((result: any) => {
      if (!result['record']) {
        // Error
        return;
      }
      this.initQuery = Tools.clone(result['record']);
      for (const key of Object.keys(this.initQuery)) {
        if (!this.extendedQuery[key]) {
          this.extendedQuery[key] = Tools.clone(this.initQuery[key]);
        }
      }
      this.updateUser(this.user.currentUser);

      // Compte le nombre de résultats
      this.object.getListCount(this.type, this.getQuery()).subscribe((res: any) => {
        if (res.count) {
          this.datacount.emit(res.count);
        }
      });

      // Récupère la liste
      this.object.getList(this.type, this.getQuery(), this.sort, `1-${this.endRow}`).subscribe((res: any) => {
        if (res.records) {
          this.data.emit({ records: res.records, ids: res.ids });
        }
        this.loading.emit({ list: false });
      });

      this.initAdditionalData();
    });
  }

  /**
   * Perform additional data queries on top of list and list count
   */
  protected initAdditionalData() {
    // Implement in project, ex. get list of all ids (not just the first 12) for map visualization
  }

  getQuery(): ValueObject {
    if (this.extendedSearch) {
      return this.extendedQuery;
    }
    return this.simpleQuery;
  }

  private resetQuery() {
    if (this.extendedSearch) {
      this.simpleQuery = {};
    } else {
      this.extendedQuery = Tools.clone(this.initQuery);
      // Initialise les critères qui viennent de l'utilisateur
      this.updateUser(this.user.currentUser);
      this.show = false;
      setTimeout(() => {
        this.show = true;
      }, 0);
    }
  }

  /**
   * A faire après la récupération des données
   */
  protected afterData() {
    // Implémenter dans l'object métier
  }
}
