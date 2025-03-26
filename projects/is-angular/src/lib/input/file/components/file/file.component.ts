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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { PropertyService } from '../../../../property/services/property.service';
import { Tools } from '../../../../util/tools';
import { FileService } from '../../services/file.service';
/**
 * Upload and download of a file using the FileResource in library is-rest
 *
 * In readonly mode the file can be downloaded
 *
 * In edit mode, the currently saved file can be removed
 *
 * In edit mode, a new file can be selected
 */
@Component({
  selector: 'is-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnChanges {
  /** Translate key for the download link, if different from filename */
  @Input() downloadKey: string;
  /** Label for the download link, if different from filename and not a translate key */
  @Input() downloadLabel: string;
  /** Translate key for when no file exists */
  @Input() emptyKey: string;
  /** Translation key for remove file, if different from filename */
  @Input() removeKey: string;
  /** Id of record that holds the file */
  @Input() id: number;
  /** Object name when different from Document */
  @Input() objName: string;
  /** Name of the blob field, if not in T_DOCUMENT */
  @Input() fieldName: string;
  /** The name of the file */
  @Input() fileName: string;
  /** True if file exists */
  @Input() hasFile = false;
  /** True when the component is readony (download enabled) */
  @Input() readonly: boolean;
  /** Mimetype (optionnel) */
  @Input() mimetype: string;
  /** Style class for download label */
  @Input() downloadClass: string;
  /** Style for download label, ex: {'font-style': styleExp} */
  @Input() downloadStyle: { [style: string]: any };
  /**
   * Pattern utilisé pour valider le nom du fichier.
   * Ce pattern doit être une expression régulière définie en fonction des règles de validation attendues.
   * Par exemple : /^[a-zA-Z0-9_-]+\.(pdf|docx|txt)$/i
   * Si le nom du fichier ne correspond pas à ce pattern, l'upload sera rejeté.
   */
  @Input() pattern: string;
  /** Positionner le bouton de suppression au-dessous du bouton upload */
  @Input() deletePositionBottom = false;
  /** Afficher un icone "download" à coté du lien du download */
  @Input() withDownloadButton = false;
  /** Afficher l'icône "Supprimer fichier séléctinné */
  @Input() withDeleteButton = true;
  /** Taille des colonnes des deux éléments en mode upload (non readonly) */
  @Input() uploadColumnClasses = { button: 'col-6', filename: 'col-6' };
  /** Permitted file types if different from backend property 'document.extensions' (ex. [.pdf]) */
  @Input() permittedTypes: string[];
  /** Upload event with id, filename and size. The temporary record holds the file until the parent record is saved. */
  @Output() upload = new EventEmitter<any>();
  /** Remove file event. The deletion is executed when the parent record is saved. */
  @Output() remove = new EventEmitter();
  /** Download failed event */
  @Output() downloadError = new EventEmitter<Response>();

  /** Maximum size of file */
  maxFileSize: number;
  /** File is not in the list of accepted types */
  typeError = false;
  /** File is too big */
  sizeError = false;
  /* Error while uploading the file to the backend, for example because the mimetype doesn't match the extension */
  validError = false;
  /** File uploaded to server */
  uploadedFile: File | undefined;
  /** True if the upload file component should be displayed */
  showFileInput = true;
  /** Téléchargement en cours */
  downloading = false;

  constructor(private file: FileService, property: PropertyService, private logger: NGXLogger) {
    if (!this.permittedTypes && property.properties['document.extensions']) {
      this.permittedTypes = property.properties['document.extensions'].split(',');
    }

    this.maxFileSize = Number(property.getProperty('document.maxfilesize')) ?? 0;
  }

  get acceptedFileTypes(): string | null {
    return this.permittedTypes ? this.permittedTypes.join(',') : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.readonly) {
      // Reset the component when the parent form is canceled or saved
      this.reset();
    }
  }

  private reset() {
    this.uploadedFile = undefined;
    this.resetErrors();
  }

  onDownload() {
    this.downloading = true;
    this.file.download(this.id, this.objName, this.mimetype, this.fieldName).subscribe(
      (blob: Blob) => {
        this.downloading = false;
        const name = this.fileName ? this.fileName.substr(0, this.fileName.indexOf('.')) : 'Document';
        const extension =
          this.fileName && this.fileName.indexOf('.') > 0 ? this.fileName.substr(this.fileName.indexOf('.') + 1, this.fileName.length) : '';
        Tools.openDocument(this.id, name, blob, extension);
      },
      (err: any) => {
        this.downloadError.emit(err);
        this.downloading = false;
      }
    );
  }

  /**
   * Uploads the file to the server when selected with the file component
   * @param event file selected in file explorer
   */
  onSelectFile(event: any) {
    this.resetErrors();

    const files = event.target.files;
    this.logger.debug('Select file', files);

    if (!this.hasFiles(files)) {
      this.logger.error('No upload files');
      return;
    }

    const file: File = files[0];

    if (this.isFileTooLarge(file)) {
      this.sizeError = true;
      this.clearInputElement();
      return;
    }

    if (!this.isPermittedFileType(file)) {
      this.typeError = true;
      this.clearInputElement();
      return;
    }

    if (!this.isValidFileName(file.name)) {
      this.logger.warn('Filename not accepted: ' + file.name);
      this.validError = true;
      this.clearInputElement();
      return;
    }

    this.uploadFile(file, files);
  }

  private resetErrors(): void {
    this.sizeError = false;
    this.typeError = false;
    this.validError = false;
  }

  private hasFiles(files: FileList | null): boolean {
    return files !== null && files.length > 0;
  }

  private isFileTooLarge(file: File): boolean {
    return file.size > this.maxFileSize;
  }

  private isPermittedFileType(file: File): boolean {
    if (!this.permittedTypes?.length) return true;
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    return this.permittedTypes.includes(ext);
  }

  private isValidFileName(name: string): boolean {
    const asciiEncoder = new TextEncoder();
    const isAscii = (): boolean => {
      try {
        asciiEncoder.encode(name);
        return true;
      } catch {
        return false;
      }
    };
    const pattern = new RegExp(this.pattern, 'i');
    return isAscii() && pattern.test(name);
  }

  private uploadFile(file: File, files: FileList): void {
    this.fileName = file.name;
    this.file.upload(files).subscribe(
      (res: any) => {
        this.logger.debug('Upload file id', res.doc_id);
        if (res.doc_id !== undefined) {
          this.uploadedFile = file;
          // Emit id, filename file size
          this.upload.emit({
            id: res.doc_id,
            filename: file.name,
            size: file.size,
          });
        } else {
          this.logger.error('No file uploaded');
        }
      },
      (err: any) => {
        console.log('Upload error', err);
        this.validError = true;
        this.clearInputElement();
      }
    );
  }

  onRemoveFile() {
    if (this.hasFile && !this.uploadedFile) {
      // Remove from parent record
      this.remove.emit();
    } else {
      // Remove from local memory
      this.uploadedFile = undefined;
    }
  }

  public clearInputElement() {
    this.fileName = '';
    this.showFileInput = false;
    setTimeout(() => {
      this.showFileInput = true;
    }, 0);
  }
}
