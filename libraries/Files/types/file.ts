/* Describes all supported filetypes
 * this will be useful for applying icons to the tree later on
 * if we don't have a filetype supported, we can just default to generic.
 */
export enum FILE_TYPE {
  GENERIC = 'generic',
  // images
  APNG = 'image/apng',
  AVIF = 'image/avif',
  GIF = 'image/gif',
  JPG = 'image/jpeg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  // archives
  ZIP = 'application/zip',
  RAR = 'application/vnd.rar',
  SEVENZIP = 'application/x-7z-compressed',
}
