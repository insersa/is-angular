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

import { FormatNumberPipe } from './format-number.pipe';

describe('FormatNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatNumberPipe();
    expect(pipe).toBeTruthy();
  });
  it('format 120 to 00120', () => {
    const pipe = new FormatNumberPipe();
    const formatted = pipe.transform(120, 5 );
    expect(formatted).toEqual('00120');
  });
  it('format 120 to 00120', () => {
    const pipe = new FormatNumberPipe();
    const formatted = pipe.transform('120', 5 );
    expect(formatted).toEqual('00120');
  });
  it('format 54 to --54', () => {
    const pipe = new FormatNumberPipe();
    const formatted = pipe.transform(54, 4, '-');
    expect(formatted).toEqual('--54');
  });
});
