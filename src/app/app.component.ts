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

import { User } from '../../projects/is-angular/src/lib/user/classes/user.model';
import { TokenService } from '../../projects/is-angular/src/lib/user/services/token.service';
import { UserService } from '../../projects/is-angular/src/lib/user/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'IS-ANGULAR';

  constructor(private token: TokenService, private user: UserService) {}

  ngOnInit() {
    // Token must not be null
    this.token.setTokenKey('demo');
    this.token.token = 'mock';

    // Add mock user in order to test certain components, ex. alert
    this.user.currentUser = new User(1, 'testuser');
  }
}
