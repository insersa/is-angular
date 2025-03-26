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

import { TelephonePipe } from './telephone.pipe';

describe('TelephonePipe', () => {
  it('create an instance', () => {
    const pipe = new TelephonePipe();
    expect(pipe).toBeTruthy();
  });

  it('format 17568811 (8 car.) to 01 756 88 11', () => {
    const pipe = new TelephonePipe();
    const formatted = pipe.transform('17568811');
    expect(formatted).toEqual('01 756 88 11');
  });

  it('format 216437711 (9 car.) to 021 643 77 11', () => {
    const pipe = new TelephonePipe();
    const formatted = pipe.transform('216437711');
    expect(formatted).toEqual('021 643 77 11');
  });

  it('format 41014256312 (11 car.) to 0041014256312', () => {
    const pipe = new TelephonePipe();
    const formatted = pipe.transform('41014256312');
    expect(formatted).toEqual('0041014256312');
  });

  it('format 410274256312 (12 car.) to 00410274256312', () => {
    const pipe = new TelephonePipe();
    const formatted = pipe.transform('410274256312');
    expect(formatted).toEqual('00410274256312');
  });

  it('format 3905211234567 (13 car.) to 3905211234567', () => {
    const pipe = new TelephonePipe();
    const formatted = pipe.transform('3905211234567');
    expect(formatted).toEqual('3905211234567');
  });

});
