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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavigationInfo } from '../../../models/interfaces/object.interface';
import { NavigationService } from '../../../navigation/services/navigation.service';
import { Tools } from '../../../util/tools';
import { ObjectsSearchComponent } from '../../components/objects-search/objects-search.component';

@Component({
  selector: 'is-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.scss'],
})
export class ObjectsComponent implements OnInit {
  /**
   * Flag pour indiquer si une recherche a été lancé (ou si les données affichés sont les initiales,
   * p.ex. les enregistrement les plus récents)
   */
  public isSearch = false;

  /**
   * Les données affichées
   */
  public list: any = [];

  /**
   * La liste des ids
   */
  public ids: number[] = [];

  /**
   * Le nombre d'enregistrements correspondants à la requête (pas le nombre affiché)
   */
  public count = 0;

  /**
   * Flag pour afficher la roue quand une recherche ou un download csv est en cours
   */
  public loading: any = { list: false, csv: false };

  /** Le composant recherche */
  // @ViewChild('search') -- circular dependency warning at compilation ngc
  // https://github.com/ng-packagr/ng-packagr/issues/710
  protected searchComponent: ObjectsSearchComponent | undefined;

  constructor(protected route: ActivatedRoute, protected navigation: NavigationService) {}

  ngOnInit() {}

  /**
   * Action de recherche a été déclenché par l'utilisateur
   */
  onSearched() {
    this.isSearch = true;
  }

  /**
   * Réception du résultat de recherche du composant recherche
   * @param object list of records and list of ids
   */
  onData(object: { records: any[]; ids: number[] }) {
    this.list = object.records;
    this.ids = object.ids;
  }

  /**
   * Reception de la prochaine tranche d'enregistrements du composant recherche
   * @param object liste of records and (optional) list of ids
   */
  onMoreData(object: { records: any[]; ids?: number[] }) {
    this.list = Tools.concatenate(this.list, object.records);
    this.ids = Tools.concatenate(this.ids, object.ids ? object.ids : []);
  }

  /**
   * Reception du nombre d'enregistrements trouvés pour une recherche
   * @param count le nombre d'enregistrements total
   */
  onDataCount(count: number) {
    this.count = count;
  }

  /**
   * Recéption d'un evénement loading (recherche ou download csv démarrée ou terminée)
   * @param loading ex. {list: true}
   */
  onLoading(loading: any) {
    const key = Object.keys(loading)[0];
    this.loading[key] = loading[key];
  }

  /**
   * Réception d'un événement de tri du composant liste
   * @param sort objet de tri: nom du champ et orientation
   */
  onSort(sort: any) {
    this.searchComponent?.onSort(sort);
  }

  /**
   * Réception d'un événement de chargement de la prochaine tranche d'enregistrements
   */
  onLoadMore() {
    this.searchComponent?.onLoadMore();
  }

  onExport() {
    this.searchComponent?.onExport();
  }

  /**
   * Sélection d'un enregistrement dans la liste
   * @param index position of the record in the list
   */
  onSelectRecord(index: number) {
    const navInfo: NavigationInfo = {
      index: index,
      type: this.searchComponent?.type as string,
      searchRoute: this.route.snapshot.url[0].path,
      searchParams: this.route.snapshot.queryParams,
      navRoute: this.route.snapshot.url[0].path,
      navQuery: this.searchComponent?.getQuery() ?? {},
      navSort: this.searchComponent?.sort ?? {},
      list: this.ids,
      listCount: this.count,
    };
    this.navigation.selectRecord(navInfo);
  }

  /**
   * Sélection de la page de création
   */
  onCreate() {
    // Utilise une requête (-> clé) différente que pour la recherche pour pas surcharger les infos de la recherche
    // gardés en mémoire dans le navigation service
    const query = this.searchComponent?.getQuery() ?? {};
    query['mode'] = 'create';
    const navInfo = {
      type: this.searchComponent?.type as string,
      searchRoute: this.route.snapshot.url[0].path,
      searchParams: this.route.snapshot.queryParams,
      navRoute: this.route.snapshot.url[0].path,
      navQuery: query,
    };
    this.navigation.newRecord(navInfo);
  }
}
