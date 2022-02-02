import { isEqual } from 'lodash'
import { Item } from './abstracts/Item.abstract'
import { FileSystemErrors } from './errors/Errors'
import { DIRECTORY_TYPE } from './types/directory'

export class Directory extends Item {
  private _type: DIRECTORY_TYPE.DEFAULT
  private _children = new Map()

  /**
   * @param  {string=''} name Name of the new directory
   * @param  {DIRECTORY_TYPE=DIRECTORY_TYPE.DEFAULT} type directory type of the new folder
   * @returns {Directory}
   */
  constructor(
    name: string = '',
    type: DIRECTORY_TYPE = DIRECTORY_TYPE.DEFAULT,
  ) {
    super(name || 'un-named directory')
    this._type = DIRECTORY_TYPE[type] ? type : DIRECTORY_TYPE.DEFAULT
  }

  /**
   * @getter content
   * @returns {Array} containing directory contents
   */
  get content(): Array<any> {
    return Array.from(this._children.values())
  }

  /**
   * @getter type
   * @returns {DIRECTORY_TYPE} returns the type of directory
   */
  get type(): DIRECTORY_TYPE {
    return this._type
  }

  /**
   * @getter
   * @returns {Directory} returns a cloned copy of this directory
   */
  get copy(): Directory {
    const dirCopy = new Directory(`${this.name} copy`, this.type)

    this.content.forEach((item) => {
      const itemCopy = item.copy
      itemCopy.name = item.name
      dirCopy.addChild(itemCopy)
    })

    return dirCopy
  }

  /**
   * @method hasChild
   * @param {string} childName the name of the child to search for
   * @returns {boolean} returns true or false depending on if a child exists in the directory
   */
  hasChild(childName: string): boolean {
    return this._children.has(childName)
  }

  /**
   * @method addChild
   * @param {Item} child the child to add to the parent directory
   * @returns {boolean} returns true or false depending on if a child exists in the directory
   */
  addChild(child: Item): boolean {
    if (this.hasChild(child.name)) return false

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

    this._children.set(child.name, child)
    child.parent = this

    return this.hasChild(child.name)
  }

  /**
   * @method getChild
   * @param {string} childName the name of the child to fetch
   * @returns {Item} returns the child if it exists, otherwise returns null
   */
  getChild(childName: string): Item {
    return this._children.get(childName) || null
  }

  /**
   * @method removeChild
   * @param {string} childName the name of the child to remove
   * @returns {Item} returns true if the child has been successfully removed
   */
  removeChild(childName: string): boolean {
    if (this.getChild(childName) === null) return false
    const child = this.getChild(childName)

    if (child) {
      this._children.delete(childName)
      child.parent = null
    }

    return !this.hasChild(childName)
  }
}
