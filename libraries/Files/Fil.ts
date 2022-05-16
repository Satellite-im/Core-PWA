import { Item } from './abstracts/Item.abstract'
import { FileSystemErrors } from './errors/Errors'

import { FILE_TYPE } from './types/file'

export class Fil extends Item {
  private _description: string = ''
  private _size: number = 0
  private _thumbnail: string
  private _extension: string
  private _nsfw: boolean

  /**
   * @constructor
   * @description call Item constructor, set Fil specific properties
   * @returns {Fil}
   */
  constructor({
    id,
    name,
    size,
    liked,
    shared,
    modified,
    description,
    type,
    thumbnail,
    extension,
    nsfw,
  }: {
    id?: string
    name: string
    size: number
    liked?: boolean
    shared?: boolean
    modified?: number
    description?: string
    type?: FILE_TYPE
    thumbnail?: string
    extension?: string
    nsfw: boolean
  }) {
    if (!size) {
      throw new Error(FileSystemErrors.FILE_SIZE)
    }
    super({ name, liked, shared, modified, id, type })
    this._description = description || ''
    this._size = size
    this._thumbnail = thumbnail || ''
    // set original extension in case user changes it during rename
    this._extension =
      extension ||
      name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
    this._nsfw = nsfw
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
      size: this.size,
      modified: this.modified,
      liked: this.liked,
      shared: this.shared,
      description: this.description,
      type: this.type as FILE_TYPE,
      thumbnail: this.thumbnail,
      extension: this.extension,
      nsfw: this._nsfw,
    })
  }

  /**
   * @getter size
   * @returns {number} file size
   */
  get size(): number {
    return this._size
  }

  /**
   * @getter modified
   * @returns {number} last modified timestamp
   */
  get modified(): number {
    return this.modifiedVal
  }

  /**
   * @getter thumbnail
   * @returns {string} base64 string of scaled down image, or '' if non-embeddable image
   */
  get thumbnail(): string {
    return this._thumbnail
  }

  /**
   * @getter extension
   * @returns {string} original extension on user upload
   */
  get extension(): string {
    return this._extension
  }

  /**
   * @getter nsfw
   * @returns nsfw status of file
   */
  get nsfw(): boolean {
    return this._nsfw
  }

  /**
   * @setter file description text
   * @param {string} content the content to set the file description to
   */
  set description(content: string) {
    this._description = content || ''
  }
}
