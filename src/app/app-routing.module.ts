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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodetestComponent } from './codetest/codetest.component';
import { DataTestComponent } from './data-test/data-test.component';
import { DiversComponent } from './divers/divers.component';
import { InputTestComponent } from './input-test/input-test.component';
import { QuerytestComponent } from './querytest/querytest.component';

const routes: Routes = [
  { path: '', redirectTo: 'input', pathMatch: 'full' },
  { path: 'input', component: InputTestComponent },
  { path: 'data', component: DataTestComponent },
  { path: 'codetest', component: CodetestComponent },
  { path: 'querytest', component: QuerytestComponent },
  { path: 'divers', component: DiversComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
