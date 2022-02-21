import { Item } from './abstracts/Item.abstract'

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _type = FILE_TYPE.GENERIC
  private _hash: string = ''
  private _description: string = ''
  private _size: number = 0

  /**
   * Create a new Fil instance
   * @constructor
   * @param param0 name,textile hash, file size, file description
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
   * @getter
   * @returns file description
   */
  get description(): string {
    return this._description
  }

  /**
   * @getter
   * @returns file type in plain text
   */
  get type(): FILE_TYPE {
    return this._type
  }

  /**
   * @getter
   * @returns hash of the file (usually IPFS)
   */
  get hash(): string {
    return this._hash
  }

  /**
   * @getter
   * @returns Get a new copy of the file
   */
  get copy(): Fil {
    return new Fil({
      name: `${this.name} copy`,
      hash: this.hash,
      size: this.size,
      description: this.description,
    })
  }

  /**
   * @getter
   * @returns file size
   */
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
