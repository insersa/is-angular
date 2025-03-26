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

import { Directive, forwardRef } from '@angular/core';
import { UntypedFormGroup, NG_VALIDATORS } from '@angular/forms';
/**
 * Validator for passwords: old password, new password and confirrm password
 *
 *
 * Instructions for use:
 *
 * 1. Create three password fields with names: oldPassword, newPassword and confirmPassword
 *
 * 2. Include them in an ngModelGroup
 *
 * 3. Add the validator to the model group
 *
 * Example: <div ngModelGroup="passwords" isValidatePassword><input name="newPassword"..> ... </div>
 *
 * See example in unit test password-validator.directive.spec.ts
 *
 * Reference https://github.com/kara/ac-forms/tree/master/src/app
 *
 */
@Directive({
  selector: '[isValidatePassword][ngModelGroup]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordValidatorDirective),
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective {
  constructor() {}

  validate(c: UntypedFormGroup): { [key: string]: any } | null {
    // Validation is canceled if at least one field is empty
    if (!c.get('newPassword') || !c.get('confirmPassword') || !c.controls['newPassword'].value || !c.controls['confirmPassword'].value) {
      return null;
    }

    // New password and confirmated password should be identical
    if (c.controls['newPassword'].value !== c.controls['confirmPassword'].value) {
      return { nomatch: true };
    }

    // Old password and new password should be distinct
    if (c.get('oldPassword') && c.get('newPassword')?.value === c.get('oldPassword')?.value) {
      return { oldmatch: true };
    }
    return null;
  }
}
