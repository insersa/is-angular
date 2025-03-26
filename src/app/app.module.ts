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

import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { CalendarModule as PrimeCalendarModule } from 'primeng/calendar';

import { AlertModule } from '../../projects/is-angular/src/lib/alert/alert.module';
import { AutocompleteModule } from '../../projects/is-angular/src/lib/input/autocomplete/autocomplete.module';
import { BooleanModule } from '../../projects/is-angular/src/lib/input/boolean/boolean.module';
import { CalendarModule } from '../../projects/is-angular/src/lib/input/calendar/calendar.module';
import { CodeModule } from '../../projects/is-angular/src/lib/input/code/code.module';
import { FileModule } from '../../projects/is-angular/src/lib/input/file/file.module';
import { PipeModule } from '../../projects/is-angular/src/lib/input/pipe/pipe.module';
import { TextModule } from '../../projects/is-angular/src/lib/input/text/text.module';
import { ValidatorModule } from '../../projects/is-angular/src/lib/input/validator/validator.module';
import { IsAngularModule } from '../../projects/is-angular/src/lib/is-angular.module';
import { PropertyModule } from '../../projects/is-angular/src/lib/property/property.module';
import { QueryBuilderModule } from '../../projects/is-angular/src/lib/query-builder/query-builder.module';
import { TableModule } from '../../projects/is-angular/src/lib/table/table.module';
import { TranslateRestLoader } from '../../projects/is-angular/src/lib/translate/translate-rest-loader';
import { TokenService } from '../../projects/is-angular/src/lib/user/services/token.service';
import { UserModule } from '../../projects/is-angular/src/lib/user/user.module';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodetestComponent } from './codetest/codetest.component';
import { DataTestComponent } from './data-test/data-test.component';
import { DiversComponent } from './divers/divers.component';
import { InputTestComponent } from './input-test/input-test.component';
import { QuerytestComponent } from './querytest/querytest.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient, logger: NGXLogger, token: TokenService) {
  return new TranslateRestLoader(http, logger, `${environment.apiEndPoint}/translate`, token);
}
export function urlConfigFactory() {
  return { url: environment.apiEndPoint };
}
export function tokenGetter() {
  return localStorage.getItem('isangular-token');
}
/**
 *
 * @param property property service
 */
export function appVersionConfigFactory() {
  return { version: '18.0.0' };
}

@NgModule({
  declarations: [AppComponent, QuerytestComponent, DiversComponent, CodetestComponent, InputTestComponent, DataTestComponent],
  bootstrap: [AppComponent],
  imports: [
    AlertModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IsAngularModule,
    AutocompleteModule,
    TextModule,
    CalendarModule,
    PipeModule,
    BooleanModule,
    ValidatorModule,
    FileModule,
    UserModule.forRoot(urlConfigFactory),
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    PrimeCalendarModule,
    FormsModule,
    QueryBuilderModule,
    TableModule,
    CodeModule.forRoot(urlConfigFactory),
    CalendarModule,
    PropertyModule.forRoot(urlConfigFactory, appVersionConfigFactory),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
