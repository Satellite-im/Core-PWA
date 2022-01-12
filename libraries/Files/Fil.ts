import { Item } from "./abstracts/Item.abstract"

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _type = FILE_TYPE.GENERIC
  private _hash: string = ''
  private _description: string = ''

  /**
   * Create a new file instance
   * @constructor
   * @param {string} name - Name of the file.
   * @param {string} description - Short description or associated text for the file
   * @param {string} hash - Hash location of the file on chain (Usually IPFS Hash)
   */
  constructor(name: string = '', description: string = '', hash: string = '') {
    super(name || 'un-named file')
    this._description = description
    this._hash = hash
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
    return new Fil(`${this.name} copy`, this._description, this._hash)
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