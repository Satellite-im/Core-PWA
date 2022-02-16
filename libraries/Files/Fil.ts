import { Item } from './abstracts/Item.abstract'

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _type = FILE_TYPE.GENERIC
  private _hash: string = ''
  private _description: string = ''
  private _size: number = 0

  /**
   * Create a new file instance
   * @constructor
   * @param {string} name - Name of the file.
   * @param {string} description - Short description or associated text for the file
   * @param {string} hash - Hash location of the file on chain (Usually IPFS Hash)
   */
  constructor({
    name,
    hash,
    size,
    description,
  }: {
    name: string
    hash: string
    size: number
    description?: string
  }) {
    super(name || 'un-named file')
    this._description = description || ''
    this._hash = hash || ''
    this._size = size || 0
  }

  /**
   * Get the file description
   * @getter
   */
  get description(): string {
    return this._description
  }

  /**
   * Get the file type in plain text
   * @getter
   */
  get type(): FILE_TYPE {
    return this._type
  }

  /**
   * Returns the hash of the file (usually IPFS)
   * @getter
   */
  get hash(): string {
    return this._hash
  }

  /**
   * Get a new copy of the file
   * @getter
   */
  get copy(): Fil {
    return new Fil({
      name: `${this.name} copy`,
      hash: this.hash,
      size: this.size,
      description: this.description,
    })
  }

  // todo store file size after textile upload
  get size(): number {
    return this._size
  }

  /**
   * Update the files description text
   * @setter
   * @param {string} content the content to set the file description to
   */
  set description(content: string) {
    this._description = `${content || ''}`
  }
}
