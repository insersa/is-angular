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

/**
 * Class of static useful tools.
 */
export class Tools {
  /**
   * Compare the objects checking every property in deep.
   * Inspired from https://stackoverflow.com/questions/40597658/equivalent-of-angular-equals-in-angular2
   *
   * @param x the firs object to compare
   * @param y the second object to compare
   * @param  ignoreUndefine set to <code>true</code> to ignore properties with undefined value.
   * @returns <code>true</code> if the objects are identical in every property name and value
   */
  public static deepEquals(x: any, y: any, ignoreUndefined = false) {
    if (x === y) {
      return true; // if both x and y are null or undefined and exactly the same
    } else if (!(x instanceof Object) || !(y instanceof Object)) {
      return false; // if they are not strictly equal, they both need to be Objects
    } else if (x.constructor !== y.constructor) {
      // they must have the exact same prototype chain, the closest we can do is
      // test their constructor.
      return false;
    } else {
      for (const p in x) {
        if (!Object.prototype.hasOwnProperty.call(x, p)) {
          continue; // other properties were tested using x.constructor === y.constructor
        }
        if (!Object.prototype.hasOwnProperty.call(y, p) && (!ignoreUndefined || x[p] !== undefined)) {
          return false; // allows to compare x[ p ] and y[ p ] when set to undefined
        }
        if (x[p] === y[p]) {
          continue; // if they have the same strict value or identity then they are equal
        }
        if (typeof x[p] !== 'object') {
          return false; // Numbers, Strings, Functions, Booleans must be strictly equal
        }
        if (!Tools.deepEquals(x[p], y[p], ignoreUndefined)) {
          return false;
        }
      }
      for (const p in y) {
        if (
          Object.prototype.hasOwnProperty.call(y, p) &&
          !Object.prototype.hasOwnProperty.call(x, p) &&
          (!ignoreUndefined || y[p] !== undefined)
        ) {
          return false;
        }
      }
      return true;
    }
  }

  /**
   * Clone un objet en profondeur
   * @param object objet à copier
   * @returns  un clone de l'objet
   */
  public static clone(object: any): any {
    if (!object) {
      return null;
    }
    if (typeof object === 'string' || typeof object === 'number') {
      return object;
    }
    const cloneObj: any = {};
    for (const attribute of Object.keys(object)) {
      if (object[attribute] instanceof Array) {
        const cloneArray = [];
        for (const item of object[attribute]) {
          cloneArray.push(this.clone(item));
        }
        cloneObj[attribute] = cloneArray;
      } else if (typeof object[attribute] === 'object') {
        cloneObj[attribute] = this.clone(object[attribute]);
      } else {
        cloneObj[attribute] = object[attribute];
      }
    }
    return cloneObj;
  }

  /**
   * Create a new array as a concatenation of two arrays.
   * @param  array1 the first array
   * @param  array2 the second array
   */
  public static newArray(array1: any[], array2: any[]): any[] {
    const array = [];
    for (const element of array1) {
      array.push(element);
    }
    for (const element of array2) {
      array.push(element);
    }
    return array;
  }

  /**
   * Ouvre un document dans le browser. Le nom du document est composé de ID, type et extension
   * @param id id de l'enregistrement
   * @param type nom de l'objet métier
   * @param fileBlob le contenu du document
   */
  public static openDocument(id: any, type: string, fileBlob: Blob, extension: string) {
    // Case IE: BLOB urls are not supported
    // http://stackoverflow.com/questions/24007073/open-links-made-by-createobjecturl-in-ie11
    const nav = window.navigator as any;
    if (nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(fileBlob, `${type}_${id}.${extension}`);
    } else {
      // création du fichier en mémoire du browser
      const fileUrl = URL.createObjectURL(fileBlob);

      // Download du fichier avec un <a></a> virtuel (option 1)
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = fileUrl;
      a.download = `${type}_${id}.${extension}`;
      a.click();
      document.body.removeChild(a);
    }
  }

  /**
   * Concatenates two lists
   * @param list1 first list
   * @param list2 second list
   */
  public static concatenate(list1: any[], list2: any[]): any[] {
    const newlist = [];
    for (const item of list1) {
      newlist.push(item);
    }
    for (const item of list2) {
      newlist.push(item);
    }
    return newlist;
  }

  /**
   * Scroll to the top on the page or the top of a sub-component, ex. popup dialog
   * @param page true if the scroll is to be made on the current page
   * @param scrollElemId id of the element to scroll to if the scroll is inside a sub-component
   */
  public static scrollToTop(page: boolean, scrollElemId: string) {
    if (page) {
      // Scroll to top
      window.scroll(0, 0);
    } else {
      // scroll to an element
      const element = document.getElementById(scrollElemId);
      if (element) {
        element.scrollIntoView();
      }
    }
  }
}
