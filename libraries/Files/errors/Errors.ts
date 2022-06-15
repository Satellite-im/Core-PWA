export enum TextileErrors {
  MISSING_WALLET = 'A wallet is mandatory for using Textile methods.',
}

export enum FileSystemErrors {
  // internal
  ITEM_ABSTRACT_ONLY = 'Item class is Abstract. It can only be extended',
  // user facing - Item
  NO_EMPTY_STRING = 'pages.files.errors.no_empty',
  INVALID = 'pages.files.errors.invalid',
  DUPLICATE_NAME = 'pages.files.errors.duplicate_name',
  LEADING_DOT = 'pages.files.errors.leading_dot',
  // user facing - Directory
  DIR_PARADOX = 'pages.files.errors.dir_paradox',
  DIR_PARENT_PARADOX = 'pages.files.errors.dir_parent_paradox',
  // user facing - Fil
  FILE_SIZE = 'pages.files.errors.file_size',
  LIMIT = 'pages.files.errors.storage_limit',
}
