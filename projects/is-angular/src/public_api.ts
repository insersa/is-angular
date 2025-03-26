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

/*
 * Public API Surface of is-angular
 */
export * from './lib/is-angular.component';

/* Modules, services, composants angular */
/* Every class must be exported explicitely without passing by index files. Needed for AOT compilation of the project
 * that imports is-angular */
export * from './lib/is-angular.module';

/** Input components, pipes and validators */
export * from './lib/input/autocomplete/autocomplete.module';
export * from './lib/input/autocomplete/components/autocomplete/autocomplete.component';
export * from './lib/input/boolean/boolean.module';
export * from './lib/input/boolean/components/boolean/boolean.component';
export * from './lib/input/calendar/calendar.module';
export * from './lib/input/calendar/components/calendar/calendar.component';
export * from './lib/input/calendar/validators/date-validator.directive';
export * from './lib/input/code/code.module';
export * from './lib/input/code/services/code.service';
export * from './lib/input/code/components/code/code.component';
export * from './lib/input/code/components/multicode/multicode.component';
export * from './lib/input/code/components/checkbox/checkbox.component';
export * from './lib/input/code/components/textcode/textcode.component';
export * from './lib/input/text/text.module';
export * from './lib/input/text/components/text/text.component';
export * from './lib/input/text/components/textarea/textarea.component';
export * from './lib/input/text/validators/telephone-validator.directive';
export * from './lib/input/text/validators/number-validator.directive';
export * from './lib/input/file/file.module';
export * from './lib/input/file/components/file/file.component';
export * from './lib/input/file/services/file.service';
export * from './lib/input/pipe/pipe.module';
export * from './lib/input/pipe/date.pipe';
export * from './lib/input/pipe/number.pipe';
export * from './lib/input/pipe/decimal.pipe';
export * from './lib/input/pipe/format-number.pipe';
export * from './lib/input/pipe/telephone.pipe';
export * from './lib/input/pipe/truncate.pipe';
export * from './lib/input/validator/validator.module';
export * from './lib/input/validator/password-validator.directive';
export * from './lib/input/validator/list-validator.directive';
export * from './lib/input/validator/boolean-validator.directive';

/** Navigation */
export * from './lib/navigation/navigation.module';
export * from './lib/navigation/components/navigation/navigation.component';
export * from './lib/navigation/models/navigation.model';
export * from './lib/navigation/services/navigation.service';

/** Errors and other messages */
export * from './lib/error/error.module';
export * from './lib/error/services/http-error-handler.service';
export * from './lib/error/services/global-error-handler.service';
export * from './lib/error/components/messages/messages.component';
export * from './lib/error/services/message.service';
export * from './lib/alert/alert.module';
export * from './lib/alert/components/alert.component';
export * from './lib/alert/services/alert.service';

/** Objects: search, list, detail, children, parts */
export * from './lib/object/object.module';
export * from './lib/object/services/object.service';
export * from './lib/object/services/object-fields.service';
export * from './lib/object/services/object-init.service';
export * from './lib/object/pages/object-detail/object-detail.component';
export * from './lib/object/pages/objects/objects.component';
export * from './lib/object/components/object-part/object-part.component';
export * from './lib/object/components/objects-search/objects-search.component';
export * from './lib/object/components/objects-search-part/objects-search-part.component';
export * from './lib/object/components/objects-list/objects-list.component';
export * from './lib/object/components/object-child/object-child.component';

export * from './lib/user/user.module';
export * from './lib/user/classes/user.model';
export * from './lib/user/classes/permission.model';
export * from './lib/user/services/permission.service';
export * from './lib/user/services/token.service';
export * from './lib/user/services/user.service';

export * from './lib/translate/translate-rest-loader';
export * from './lib/translate/missing-rest-translation-handler-params';

export * from './lib/property/property.module';
export * from './lib/property/services/property.service';
export * from './lib/property/services/session.service';
export * from './lib/property/services/version.service';

export * from './lib/help/help.module';
export * from './lib/help/services/help.service';
export * from './lib/help/components/help-tooltip/help-tooltip.component';

export * from './lib/scroll-top/scroll-top.module';
export * from './lib/scroll-top/components/scroll-top/scroll-top.component';

export * from './lib/safe/safe.module';
export * from './lib/safe/pipes/safe.pipe';

export * from './lib/table/table.module';
export * from './lib/table/components/table/table.component';
export * from './lib/table/components/row/row.component';
export * from './lib/table/components/column/column.component';
export * from './lib/table/directives/template.directive';

/* Query Builder */
export * from './lib/query-builder/query-builder.module';
export * from './lib/query-builder/component/query-builder.component';
export * from './lib/query-builder/component/query-builder.interfaces';
export * from './lib/query-builder/directives/query-button-group.directive';
export * from './lib/query-builder/directives/query-entity.directive';
export * from './lib/query-builder/directives/query-field.directive';
export * from './lib/query-builder/directives/query-input.directive';
export * from './lib/query-builder/directives/query-operator.directive';
export * from './lib/query-builder/directives/query-switch-group.directive';
export * from './lib/query-builder/directives/query-remove-button.directive';
export * from './lib/query-builder/directives/query-empty-warning.directive';
export * from './lib/query-builder/directives/query-arrow-icon.directive';

/* Document */
export * from './lib/document/document.module';
export * from './lib/document/services/document.service';

/* Classes std typescript */
export * from './lib/util/config';
export * from './lib/util/tools';

/** Interfaces */
export * from './lib/models/interfaces/object.interface';
export * from './lib/models/interfaces/code.interface';

/* Classes pour tests */
export * from './lib/test/jwt-configuration';
export * from './lib/test/object-configuration';
export * from './lib/test/property-configuration';
export * from './lib/test/token-configuration';
export * from './lib/test/translate-configuration';
export * from './lib/test/user-configuration';
export * from './lib/test/version-configuration';
export * from './lib/test/navigation-configuration';
export * from './lib/test/code-configuration';
