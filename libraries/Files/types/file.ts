/* Describes all supported filetypes
 * this will be useful for applying icons to the tree later on
 * if we don't have a filetype supported, we can just default to generic.
 * todo AP-931 - fill this out following ticket instructions
 */
export enum FILE_TYPE {
  GENERIC = 'generic',

  // application - todo
  ARC = 'application/x-freearc',
  BZ = 'application/x-bzip',
  BZTWO = 'application/x-bzip2',
  GZIP = 'application/gzip',
  JAR = 'application/java-archive',
  PDF = 'application/pdf',
  RAR = 'application/vnd.rar',
  TAR = 'application/x-tar',
  ZIP = 'application/zip',
  SEVENZIP = 'application/x-7z-compressed',

  // image - embeddable
  APNG = 'image/apng',
  AVIF = 'image/avif',
  GIF = 'image/gif',
  JPG = 'image/jpeg',
  PNG = 'image/png',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',

  // image - non-embeddable
  BMP = 'image/bmp',
  HEIC = 'image/heic',
  ICO = 'image/vnd.microsoft.icon',
  TIFF = 'image/tiff',
}
