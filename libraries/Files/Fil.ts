import { Item } from './abstracts/Item.abstract'

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _description: string = ''
  private _size: number = 0
  private _file: File | undefined
  private _thumbnail: string

  /**
   * @constructor
   * @description call Item constructor, set Fil specific properties
   * @returns {Fil}
   */
  constructor({
    id,
    name,
    file,
    size,
    liked,
    shared,
    modified,
    description,
    type,
    thumbnail,
  }: {
    id?: string
    name: string
    file?: File
    size: number
    liked?: boolean
    shared?: boolean
    modified?: number
    description?: string
    type?: FILE_TYPE
    thumbnail?: string
  }) {
    super({ name: name || 'un-named file', liked, shared, modified, id, type })
    this._file = file || undefined
    this._description = description || ''
    this._size = size || 0
    this._thumbnail = thumbnail || ''
  }

  /**
   * @getter description
   * @returns file description
   */
  get description(): string {
    return this._description
  }

  /**
   * @getter copy
   * @returns Get a new copy of the file
   */
  get copy(): Fil {
    return new Fil({
      name: `${this.name} copy`,
      file: this._file,
      size: this.size,
      modified: this.modified,
      liked: this.liked,
      shared: this.shared,
      description: this.description,
      type: this.type as FILE_TYPE,
      thumbnail: this.thumbnail,
    })
  }

  /**
   * @getter size
   * @returns file size
   */
  get size(): number {
    return this._size
  }

  /**
   * @getter modified
   * @returns last modified timestamp
   */
  get modified(): number {
    return this.modifiedVal
  }

  /**
   * @getter file
   * @returns file object fetched from textile bucket
   */
  get file(): File | undefined {
    return this._file
  }

  /**
   * @setter file
   * @param {File} file file object
   */
  set file(file: File | undefined) {
    this._file = file
  }

  /**
   * @getter url
   * @returns link of locally stored File for image preview and downloads
   */
  get url(): string {
    return this.file ? URL.createObjectURL(this.file) : ''
  }

  /**
   * @getter url
   * @returns link of localally stored File for image preview and downloads
   */
  get thumbnail(): string {
    return this._thumbnail
  }

  /**
   * @setter file description text
   * @param {string} content the content to set the file description to
   */
  set description(content: string) {
    this._description = `${content || ''}`
  }
}
