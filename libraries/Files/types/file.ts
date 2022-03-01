/* Describes all supported filetypes
 * this will be useful for applying icons to the tree later on
 * if we don't have a filetype supported, we can just default to generic.
 */
export enum FILE_TYPE {
  GENERIC = 'GENERIC',
  IMAGE_PNG = 'IMG/PNG',
  ARCHIVE = 'ARCHIVE/ZIP',
}
