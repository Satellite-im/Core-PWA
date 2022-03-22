import { Item } from './abstracts/Item.abstract'

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _type = FILE_TYPE.GENERIC
  private _path: string = ''
  private _description: string = ''
  private _size: number = 0
  private _file: File | undefined
  private _thumbnail: string

  /**
   * @constructor
   * @param param0  name, file, path, size, liked, shared, modified, description, type, thumbnail
   * @returns {Fil}
   */
  constructor({
    name,
    file,
    path,
    size,
    liked,
    shared,
    modified,
    description,
    type,
    thumbnail,
  }: {
    name: string
    file?: File
    path: string
    size: number
    liked?: boolean
    shared?: boolean
    modified?: number
    description?: string
    type?: FILE_TYPE
    thumbnail?: string
  }) {
    super({ name: name || 'un-named file', liked, shared, modified })
    this._file = file || undefined
    this._description = description || ''
    this._path = path || ''
    this._size = size || 0
    this._type = type || FILE_TYPE.GENERIC
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
   * @getter type
   * @returns file type in plain text
   */
  get type(): FILE_TYPE {
    return this._type
  }

  /**
   * @getter hash
   * @returns hash of the file (usually IPFS)
   */
  get path(): string {
    return this._path
  }

  /**
   * @getter copy
   * @returns Get a new copy of the file
   */
  get copy(): Fil {
    return new Fil({
      name: `${this.name} copy`,
      file: this._file,
      path: this.path,
      size: this.size,
      modified: this.modified,
      liked: this.liked,
      shared: this.shared,
      description: this.description,
      type: this.type,
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
