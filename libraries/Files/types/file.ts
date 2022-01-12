/* Describes all supported filetypes
 * this will be useful for applying icons to the tree later on
 * if we don't have a filetype supported, we can just default to generic.
 */
export const enum FILE_TYPE {
  GENERIC = 'generic',
  IMAGE_PNG = 'img/png',
  ARCHIVE = 'archive/zip',
}
