import { isEqual } from 'lodash'
import { FileSortEnum } from '../Enums/enums'
import { Item } from './abstracts/Item.abstract'
import { FileSystemErrors } from './errors/Errors'
import { Fil } from './Fil'
import { DIRECTORY_TYPE } from './types/directory'
import { FileSort } from '~/store/ui/types'

export class Directory extends Item {
  private _children = new Map()

  /**
   * @constructor
   * @description call Item constructor
   * @returns {Directory}
   */
  constructor({
    id,
    name,
    liked,
    shared,
    modified,
    type,
  }: {
    id?: string
    name: string
    liked?: boolean
    shared?: boolean
    modified?: number
    type?: DIRECTORY_TYPE
  }) {
    super({
      id,
      name,
      liked,
      shared,
      modified,
      type,
    })
  }

  /**
   * @getter content
   * @returns {Array} containing directory contents
   */
  get content(): Array<Item> {
    return Array.from(this._children.values())
  }

  /**
   * @getter modified
   * @returns last modified timestamp
   */
  get modified(): number {
    return this.content.length
      ? Math.max(...this.content.map((item) => item.modified))
      : this.modifiedVal
  }

  /**
   * @getter size
   * @returns {number} dir size in bytes
   */
  get size(): number {
    return this.content.length
      ? this.content.reduce((total, item) => total + item.size, 0)
      : 0
  }

  /**
   * @getter copy
   * @returns {Directory} returns a cloned copy of this directory
   */
  get copy(): Directory {
    const dirCopy = new Directory({
      id: this.id,
      name: `${this.name} copy`,
      liked: this.liked,
      shared: this.shared,
      type: this.type as DIRECTORY_TYPE,
    })

    this.content.forEach((item) => {
      const itemCopy = (item as Directory | Fil).copy
      itemCopy.name = item.name
      dirCopy.addChild(itemCopy)
    })

    return dirCopy
  }

  /**
   * @method sortedContent
   * @param {FileSort} sort current sort key and asc/desc boolean
   * @returns {Item[]} array of sorted content within the CURRENT directory
   */
  sortedContent(sort: FileSort): Item[] {
    const key = sort.category
    if (key === FileSortEnum.SIZE) {
      return this.content.sort(
        sort.asc
          ? (a: Item, b: Item) => a[key] - b[key]
          : (a: Item, b: Item) => b[key] - a[key],
      )
    }
    if (key === FileSortEnum.MODIFIED) {
      return this.content.sort(
        sort.asc
          ? (a: Item, b: Item) => b[key] - a[key]
          : (a: Item, b: Item) => a[key] - b[key],
      )
    }

    return this.content.sort(
      sort.asc
        ? (a: Item, b: Item) => a[key].localeCompare(b[key])
        : (a: Item, b: Item) => b[key].localeCompare(a[key]),
    )
  }

  /**
   * @method hasChild
   * @param {string} childName the name of the child to search for
   * @returns {boolean} true or false depending on if a child exists in the directory
   */
  hasChild(childName: string): boolean {
    return this._children.has(childName.toLowerCase())
  }

  /**
   * @method addChild
   * @param {Item} child the child to add to the parent directory
   * @returns {boolean} true or false depending on if a child exists in the directory
   */
  addChild(child: Item): boolean {
    if (this.hasChild(child.name)) {
      throw new Error(FileSystemErrors.DUPLICATE_NAME)
    }

    if (isEqual(child, this)) {
      throw new Error(FileSystemErrors.DIR_PARADOX)
    }

    let parent = this.parent

    while (!isEqual(parent, null)) {
      if (isEqual(parent, child)) {
        throw new Error(FileSystemErrors.DIR_PARENT_PARADOX)
      }
      parent = parent!.parent
    }

    this._children.set(child.name.toLowerCase(), child)
    child.parent = this

    return this.hasChild(child.name)
  }

  /**
   * @method getChild
   * @param {string} childName the name of the child to fetch
   * @returns {Item | null} returns the child if it exists, otherwise returns null
   */
  getChild(childName: string): Item {
    return this._children.get(childName.toLowerCase()) || null
  }

  /**
   * @method removeChild
   * @param {string} childName the name of the child to remove
   * @returns {boolean} true if the child has been successfully removed
   */
  removeChild(childName: string): boolean {
    if (this.getChild(childName) === null) return false
    const child = this.getChild(childName)

    if (child) {
      this._children.delete(childName.toLowerCase())
      child.parent = null
    }

    return !this.hasChild(childName)
  }
}
