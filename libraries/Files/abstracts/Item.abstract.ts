import { v4 as uuidv4 } from 'uuid'
import { Directory } from '../Directory'
import { FileSystemErrors } from '../errors/Errors'
import { ItemInterface } from '../interface/Item.interface'
import { FileType, DirectoryType } from '~/libraries/Enums/enums'

import { Config } from '~/config'

export abstract class Item implements ItemInterface {
  private _id: string = ''
  private _name: string = ''
  private _parent: Directory | null | undefined = null
  private _liked: boolean = false
  private _shared: boolean = false
  private _modified: number
  private _type: FileType | DirectoryType
  abstract modified: number
  abstract size: number

  /**
   * @constructor
   * @description set shared properties for Fil and Directory
   */
  constructor({
    id,
    name,
    liked,
    shared,
    parent,
    modified,
    type,
  }: {
    id?: string
    name: string
    shared?: boolean
    liked?: boolean
    parent?: Directory
    modified?: number
    type?: FileType | DirectoryType
  }) {
    if (this.constructor.name === 'Item')
      throw new Error(FileSystemErrors.ITEM_ABSTRACT_ONLY)

    this._validateName(name)

    this._id = id || uuidv4()
    this._name = name
    this._shared = shared || false
    this._liked = liked || false
    this._parent = parent || null
    this._modified = modified || Date.now()
    this._type =
      type ||
      (this.constructor.name === 'Fil'
        ? FileType.GENERIC
        : DirectoryType.DEFAULT)
  }

  /**
   * @getter
   * @returns the path of the item
   */
  get path(): string {
    if (this.validateParent(this.parent))
      return `${this._parent?.path}/${this._name}`

    return this._name
  }

  /**
   * @getter
   * @returns the item name
   */
  get name(): string {
    return this._name
  }

  /**
   * @getter
   * @returns a unique identifier for the item - uuid
   */
  get id(): string {
    return this._id
  }

  /**
   * @getter
   * @returns the parent directory
   */
  get parent(): Directory | null {
    // Make sure we always return either null or the parent. Never undefined.
    return this._parent !== undefined ? this._parent : null
  }

  /**
   * @getter
   * @returns the liked status
   */
  get liked(): boolean {
    return this._liked
  }

  /**
   * @getter
   * @returns the shared status
   */
  get shared(): boolean {
    return this._shared
  }

  /**
   * @getter type
   * @returns file type in plain text
   */
  get type(): FileType | DirectoryType {
    return this._type
  }

  /**
   * @protected
   * @getter modifiedVal
   * @returns last modified timestamp
   */
  protected get modifiedVal(): number {
    return this._modified
  }

  /**
   * @method toggleLiked
   * @description toggle liked status
   */
  toggleLiked() {
    this._liked = !this._liked
  }

  /**
   * @method shareItem
   * @description set shared status to true
   */
  shareItem() {
    this._shared = true
  }

  /**
   * @method validateParent
   * @description Validate that the parent is of the correct instance type
   * @param {Directory} parent - The new name of the associated file.
   */
  private validateParent(parent: Directory | null): boolean {
    // In the future we may want shared directory types and more
    return (
      parent !== null && (parent as Directory).type === DirectoryType.DEFAULT
    )
  }

  /**
   * @method validateName
   * @description Validate prospective item name
   * @param {string} name
   */
  private _validateName(name: string) {
    if (Config.regex.empty.test(name)) {
      throw new Error(FileSystemErrors.NO_EMPTY_STRING)
    }

    if (name[0] === '.') {
      throw new Error(FileSystemErrors.LEADING_DOT)
    }

    if (Config.regex.invalid.test(name)) {
      throw new Error(FileSystemErrors.INVALID)
    }

    if (this.validateParent(this.parent) && this.parent?.hasChild(name)) {
      throw new Error(FileSystemErrors.DUPLICATE_NAME)
    }
  }

  /**
   * @setter
   * @description Set a new name for this item.
   * @param {string} newName - The new name of the associated file.
   */
  set name(newName: string) {
    this._validateName(newName)
    this._name = newName
  }

  /**
   * @setter
   * @description Update the parent directory for this item
   * @param {Directory} newPARENT - The new name of the associated file.
   */
  set parent(newParent: Directory | null) {
    if (newParent !== this._parent) {
      const prevParent = this._parent
      this._parent = newParent

      if (prevParent) prevParent.removeChild(this.name)
    }
  }
}
