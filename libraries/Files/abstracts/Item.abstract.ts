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
  abstract type: DIRECTORY_TYPE | FILE_TYPE

  /**
   * Update the parent directory for this item
   * @constructor
   * @param {string} name - Name of the item.
   * @param {Parent} parent - Optional parent of the item.
   */
  constructor(name: string, parent?: Directory | null) {
    if (this.constructor.name === 'Item')
      throw new Error(FileSystemErrors.ITEM_ABSTRACT_ONLY)

    this._name = name
    this._parent = parent
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
  get name() {
    return this._name
  }

  /**
   * @getter
   * @returns a unique identifier for the item
   */
  get id() {
    return this._id
  }

  /**
   * @getter
   * @returns the parent directory
   */
  get parent() {
    // Make sure we always return either null or the parent. Never undefined.
    return this._parent !== undefined ? this._parent : null
  }

  /**
   * Validate that the parent is of the correct instance type
   * @method
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
    const filenameTest = new RegExp('[\\/:"*?<>|]+')

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

      if (newParent) newParent.addChild(this)
    }
  }
}
