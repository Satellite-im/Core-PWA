import { v4 as uuidv4 } from 'uuid'
import { Directory } from '../Directory'
import { FileSystemErrors } from '../errors/Errors'
import { ItemInterface } from '../interface/Item.interface'
import { DIRECTORY_TYPE } from '../types/directory'
import { FILE_TYPE } from '../types/file'

export abstract class Item implements ItemInterface {
  private _id: string = uuidv4()
  private _name: string = ''
  private _parent: Directory | null | undefined = null
  private _liked: boolean = false
  private _shared: boolean = false
  private _modified: number
  abstract type: DIRECTORY_TYPE | FILE_TYPE
  abstract modified: number
  abstract size: number

  /**
   * Update the parent directory for this item
   * @constructor
   * @param {string} name - Name of the item.
   * @param {Parent} parent - Optional parent of the item.
   */
  constructor({
    name,
    liked,
    shared,
    parent,
    modified,
  }: {
    name: string
    shared?: boolean
    liked?: boolean
    parent?: Directory
    modified?: number
  }) {
    if (this.constructor.name === 'Item')
      throw new Error(FileSystemErrors.ITEM_ABSTRACT_ONLY)

    this._name = name
    this._shared = shared || false
    this._liked = liked || false
    this._parent = parent || null
    this._modified = modified || Date.now()
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
   * @returns a unique identifier for the item
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
   * Validate that the parent is of the correct instance type
   * @method validateParent
   * @param {string} newName - The new name of the associated file.
   */
  private validateParent(parent: Directory | null): boolean {
    // In the future we may want shared directory types and more
    return (
      parent !== null && (parent as Directory).type === DIRECTORY_TYPE.DEFAULT
    )
  }

  /**
   * Set a new name for this item.
   * @setter
   * @param {string} newName - The new name of the associated file.
   */
  set name(newName: string) {
    const filenameTest = /[/:"*?<>|]+/

    if (!newName || typeof newName !== 'string' || !newName.trim().length)
      throw new Error(FileSystemErrors.NO_EMPTY_STRING)

    if (filenameTest.test(newName))
      throw new Error(FileSystemErrors.INVALID_SYMBOL)

    if (this.validateParent(this.parent) && this.parent?.hasChild(newName))
      throw new Error(FileSystemErrors.DUPLICATE_NAME)

    this._name = newName.trim()
  }

  /**
   * Update the parent directory for this item
   * @method
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
