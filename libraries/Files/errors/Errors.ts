export enum TextileErrors {
  MISSING_WALLET = 'A wallet is mandatory for using Textile methods.',
}

export enum FileSystemErrors {
  METHOD_MISSING = 'Method not implemented.',
  RFM_ABSTRACT_ONLY = 'RFM class is Abstract. It can only be extended',
  ITEM_ABSTRACT_ONLY = 'Item class is Abstract. It can only be extended',
  NO_EMPTY_STRING = 'Item name must be a non empty string',
  INVALID = 'Item name cannot contain invalid symbols',
  DUPLICATE_NAME = 'Item with name already exists in this directory',
  DIR_PARADOX = 'Directory cannot contain itself',
  DIR_PARENT_PARADOX = 'Directory cannot contain one of its ancestors',
  LEADING_DOT = 'Item name cannot begin with .',
}
