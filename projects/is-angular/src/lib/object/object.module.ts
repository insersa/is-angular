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

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ErrorModule } from '../error/error.module';
import { TableModule } from '../table/table.module';
import { UserModule } from '../user/user.module';
import { UrlConfig } from '../util/config';

import { ObjectChildComponent } from './components/object-child/object-child.component';
import { ObjectPartComponent } from './components/object-part/object-part.component';
import { ObjectsListComponent } from './components/objects-list/objects-list.component';
import { ObjectsSearchComponent } from './components/objects-search/objects-search.component';
import { ObjectsSearchPartComponent } from './components/objects-search-part/objects-search-part.component';
import { ObjectDetailComponent } from './pages/object-detail/object-detail.component';
import { ObjectsComponent } from './pages/objects/objects.component';
import { ObjectFieldsService } from './services/object-fields.service';
import { ObjectInitService } from './services/object-init.service';
import { ObjectService } from './services/object.service';

@NgModule({
  declarations: [
    ObjectsSearchComponent,
    ObjectsListComponent,
    ObjectChildComponent,
    ObjectsComponent,
    ObjectDetailComponent,
    ObjectPartComponent,
    ObjectsSearchPartComponent,
  ],
  exports: [
    ObjectsSearchComponent,
    ObjectsListComponent,
    ObjectChildComponent,
    ObjectsComponent,
    ObjectDetailComponent,
    ObjectPartComponent,
    ObjectsSearchPartComponent,
  ],
  imports: [CommonModule, UserModule, ErrorModule, FormsModule, TableModule],
  providers: [ObjectService, ObjectFieldsService, ObjectInitService, provideHttpClient(withInterceptorsFromDi())],
})
/**
 * Module pour les services et fonctions génériques des objets métier
 *
 * (comme AbstractBackedBean, AbstractJsfBbBean, AbstractListBean dans JSF)
 */
export class ObjectModule {
  static forRoot(urlConfigFactory: () => { url: string }): ModuleWithProviders<ObjectModule> {
    return {
      ngModule: ObjectModule,
      providers: [{ provide: UrlConfig, useFactory: urlConfigFactory }],
    };
  }
}
