export enum FileSortEnum {
  NAME = 'name',
  MODIFIED = 'modified',
  TYPE = 'type',
  SIZE = 'size',
}

export enum FileIconsEnum {
  CLOCK = 'clock',
  TRASH = 'trash',
  HEART = 'heart',
  FOLDER = 'folder',
  LINK = 'link',
}

export enum FileAsideRouteEnum {
  DEFAULT = '',
  RECENT = 'recent',
  DELETED = 'deleted',
  FAVORITED = 'favorited',
  SHARED = 'shared',
  LINKS = 'links',
}

/* Describes all supported filetypes
 * this will be useful for applying icons to the tree later on
 * if we don't have a filetype supported, we can just default to generic.
 */
export enum FileType {
  GENERIC = 'generic',

  // application
  ABW = 'application/x-abiword',
  ARC = 'application/x-freearc',
  AZW = 'application/vnd.amazon.ebook',
  BIN = 'application/octet-stream',
  BZ = 'application/x-bzip',
  BZ2 = 'application/x-bzip2',
  CDA = 'application/x-cdf',
  CSH = 'application/x-csh',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  EOT = 'application/vnd.ms-fontobject',
  EPUB = 'application/epub+zip',
  GZ = 'application/gzip',
  JAR = 'application/java-archive',
  JSON = 'application/json',
  JSONLD = 'application/ld+json',
  MPKG = 'application/vnd.apple.installer+xml',
  ODP = 'application/vnd.oasis.opendocument.presentation',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',
  ODT = 'application/vnd.oasis.opendocument.text',
  OGX = 'application/ogg',
  PDF = 'application/pdf',
  PHP = 'application/x-httpd-php',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  RAR = 'application/vnd.rar',
  RTF = 'application/rtf',
  SH = 'application/x-sh',
  SWF = 'application/x-shockwave-flash',
  TAR = 'application/x-tar',
  VSD = 'application/vnd.visio',
  XHTML = 'application/xhtml+xml',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ZIP = 'application/zip',
  SZIP = 'application/x-7z-compressed',

  // audio
  AAC = 'audio/aac',
  MID = 'audio/midi',
  MIDI = 'audio/x-midi',
  MP3 = 'audio/mpeg',
  OGA = 'audio/ogg',
  OPUS = 'audio/opus',
  WAV = 'audio/wav',
  WEBMA = 'audio/webm',
  TGPA = 'audio/3gpp',
  TGPA2 = 'audio/3gpp2',

  // font
  OTF = 'font/otf',
  TTF = 'font/ttf',
  WOFF = 'font/woff',
  WOFF2 = 'font/woff2',

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
  HEIC = 'image/heic', // non-embeddable, but we convert as needed
  HEIF = 'image/heif', // non-embeddable, but we convert as needed
  ICO = 'image/vnd.microsoft.icon',
  TIFF = 'image/tiff',

  // model

  // text
  CSS = 'text/css',
  CSV = 'text/csv',
  HTML = 'text/html',
  ICS = 'text/calendar',
  JS = 'text/javascript',
  TXT = 'text/plain',

  // video
  AVI = 'video/x-msvideo',
  MP4 = 'video/mp4',
  MPEG = 'video/mpeg',
  MOV = 'video/quicktime',
  OGV = 'video/ogg',
  TS = 'video/mp2t',
  WEBM = 'video/webm',
  TGPV = 'video/3gpp',
  TGPV2 = 'video/3gpp2',

  XML = 'XML',
  XUL = 'XUL',
}

export enum DirectoryType {
  DEFAULT = 'default',
}
