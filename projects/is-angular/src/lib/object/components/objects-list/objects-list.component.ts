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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'is-objects-list',
  templateUrl: './objects-list.component.html',
  styleUrls: ['./objects-list.component.scss'],
})
export class ObjectsListComponent implements OnInit {
  /**
   * Trie par défaut lors de l'initialisation
   */
  @Input() initSort: any;
  /**
   * La liste d'objets
   */
  @Input() list: any[] = [];

  /** Total number of records (only a threshold number of records are loaded)  */
  @Input() count: number;

  /** Actions en cours, ex. {csv: false, list: true}*/
  @Input() loading: any;

  /**
   * Envoie une demande de tri ['sort': nom_du_champ} ou {'desc': nom_du_champ}
   */
  @Output() sort = new EventEmitter<any>();

  /**
   * Export csv de la liste
   */
  @Output() export = new EventEmitter();

  /**
   * Envoie une demande de charger plus de données dans la liste
   */
  @Output() loadMore = new EventEmitter<any>();

  /**
   * Sélection d'un enregistrement dans la liste
   */
  @Output() selectItem = new EventEmitter<number>();

  /**
   * Nom du champ pour le trie par défaut lors de l'initialisation
   */
  sortField: string;

  /**
   * Ordre de trie par défaut lors de l'initialisation
   *
   * Valeur 1 = desc, -1 = asc
   */
  sortOrder: number;

  /**
   * Pour chaque orientation le dernier champ trié.
   * Utilisé pour que le sortFunction de p-column ne rentre pas dans une boucle.
   * Et pour initialiser les infos pour la navigation (next, previous)
   */
  latestsorts: any = {};

  constructor() {}

  /**
   * Exécution après initialisation du component
   */
  ngOnInit() {
    this.initSortField(this.initSort);
  }

  /**
   * Initialise le sortfield et sortorder dans le p-datatable
   * @param sort tri initiale {sort: fieldname} ou {desc: fieldname}
   */
  private initSortField(sort: any) {
    // Traduction du trie par défaut pour le p-datatable de prime
    if (sort !== undefined) {
      if (sort.desc) {
        this.sortField = sort.desc;
        this.sortOrder = -1;
      } else {
        this.sortField = sort.sort;
        this.sortOrder = 1;
      }
      this.latestsorts = sort;
    }
  }

  /**
   * Envoui une emission d'evénement de tri
   * @param event événement tri depuis un p-column (sortFunction)
   */
  onSort(event: any) {
    let sort;
    if (event.order === 1) {
      if (this.latestsorts['sort'] !== event.field) {
        sort = { sort: event.field };
      }
    } else {
      if (this.latestsorts['desc'] !== event.field) {
        sort = { desc: event.field };
      }
    }
    if (sort) {
      this.initSortField(sort);
      this.sort.emit(sort);
    }
  }

  /**
   * Demande de charger plus de données
   */
  onLoadMore() {
    this.loadMore.emit(null);
  }

  /**
   * Sélection d'export de la liste
   */
  public onExport() {
    this.export.emit();
  }

  /**
   * Sélection d'un enregistrement pour consultation
   * @param index de l'enregistrement
   */
  public onSelect(index: number) {
    this.selectItem.emit(index);
  }
}
