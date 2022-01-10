import { Directory } from './Directory'
import { DIRECTORY_TYPE } from './types/directory'
import { Fil } from './Fil'
import { Item } from './abstracts/Item.abstract'

export class FileSystem {
  private _self = new Directory('root')
  private _currentDirectory = this._self
  private _currentDirectoryPath = [this._currentDirectory] // as stack

  /**
   * @getter currentDirectory
   * @returns {Directory} containing the current active directory
   */
  get currentDirectory(): Directory {
    return this._currentDirectory
  }

  /**
   * @getter currentDirectoryPath
   * @returns {string[]} returns string array of directory pathing usually joined by '/'
   */
  get currentDirectoryPath(): string[] {
    return this._currentDirectoryPath.map((dir: Directory) => dir.name)
  }

  /**
   * @getter root
   * @returns {Directory} returns the root directory
   */
  get root(): Directory {
    return this._self
  }

  /**
   * @getter parent
   * @returns null - filesystem always has no parent this is just to fit the interface
   */
  get parent(): null {
    return null
  }

  /**
   * @getter name
   * @returns {string} returns own name
   */
  get name(): string {
    return this.root.name
  }

  /**
   * @getter copy
   * @returns {FileSystem} Returns a copy of the entire filesystem
   */
  get copy(): FileSystem {
    const fsCopy = new FileSystem()

    this.root.content.forEach((item) => {
      const itemCopy = item.copy
      itemCopy.name = item.name
      fsCopy.addChild(itemCopy)
    })

    return fsCopy
  }

  /**
   * @getter copy
   * @returns {any[]} Returns an array of all content within the CURRENT directory
   */
  get content(): any[] {
    return this.currentDirectory.content
  }

  /**
   * @method createFile
   * @argument {string} fileName name of the new file to create
   * @argument {any[]} options list of additional arguments to pass to new file
   * @returns {Fil | null} Returns the new file if successfully created, else null
   */
  public createFile(fileName: string, ...options: any[]): Fil | null {
    const newFile = new Fil(fileName, ...options)
    const inserted = this.addChild(newFile)
    return inserted ? newFile : null
  }

  /**
   * @method createDirectory
   * @argument {string} dirName name of the new directory to create
   * @argument {type} DIRECTORY_TYPE Default for now
   * @returns {Fil | null} Returns the new directory if successfully created, else null
   */
  public createDirectory(dirName: string, type = DIRECTORY_TYPE.DEFAULT): Directory | null {
    const newDir = new Directory(dirName, type)
    const inserted = this.currentDirectory.addChild(newDir)
    return inserted ? newDir : null
  }

  /**
   * @method addChild
   * @argument {Item} child item to add to the filesystem
   * @returns {boolean} returns truthy if the child was added
   */
  public addChild(child: Item): boolean {
    return this.currentDirectory.addChild(child)
  }

  /**
   * @method getChild
   * @argument {string} childName name of the child to fetch
   * @returns {Directory | Item} returns directory or Fil
   */
  public getChild(childName: string): Directory | Item {
    return this.currentDirectory.getChild(childName)
  }

  /**
   * @method hasChild
   * @argument {string} childName name of the child to check for
   * @returns {boolean} returns truthy if child by name exists in filesystem
   */
  public hasChild(childName: string): boolean {
    return this.currentDirectory.hasChild(childName)
  }

  /**
   * @method removeChild
   * @argument {string} childName name of the child to remove
   * @returns {boolean} returns truthy if child was removed
   */
  public removeChild(childName: string): boolean {
    return this.currentDirectory.removeChild(childName)
  }

  /**
   * @method removeChild
   * @argument {string} childName name of the child to remove
   * @returns {boolean} returns truthy if child was removed
   */
  public renameChild(currentName: string, newName: string): Item | null {
    const item = this.getChild(currentName)

    if (item) {
      item.name = newName
      this.removeChild(currentName)
      this.addChild(item)
      return item
    }

    return null
  }

  /**
   * @method copyChild
   * @argument {string} childName name of the child to copy
   * @returns {Item | null} returns newly copied child, or null if it fails
   */
  public copyChild(childName: string): Item | null {
    const item = this.getChild(childName) as Fil

    if (item) {
      const itemCopy = item.copy
      this.addChild(itemCopy)
      return itemCopy
    }

    return null
  }

  /**
   * @method printCurrentDirectory
   */
  public printCurrentDirectory(): void {
    console.log(
      `\n[${this.currentDirectoryPath.join('/')}]:` +
        (this.currentDirectory.content
          .map(
            (item) =>
              `\n[${item.constructor.name.substring(0, 1)}]-> ${item.name}`,
          )
          .join('') || '\n(empty)'),
    )
  }

  /**
   * @method openDirectory
   * This will navigate the filesystem to the directory at this path
   * @argument {string} path path to navigate to
   * @returns {Directory | null} returns the opened directory
   */
  public openDirectory(path: string): Directory | null {
    if (!path) return null

    let dir = this.getDirectoryFromPath(path as string)
    if (!(dir && dir instanceof Directory)) return null

    const dirPath = [dir]
    let parent = dir.parent

    while (parent) {
      dirPath.unshift(parent)
      parent = parent.parent
    }

    this._currentDirectory = dir
    this._currentDirectoryPath = dirPath

    return dir
  }

  /**
   * @method goBack
   * This will navigate the filesystem to the directory at this path
   * @argument {string} steps number of steps to go back (will go to root if too many are provided)
   * @returns {Directory | null} returns the opened directory
   */
  public goBack(steps: number = 1): Directory | null {
    if (isNaN(steps) || steps <= 0 || steps >= this.currentDirectoryPath.length)
      return null

    let dir = this.currentDirectory
    let stepsMoved = steps

    while (dir && stepsMoved > 0) {
      if (dir.parent) dir = dir.parent
      stepsMoved -= 1
    }

    if (dir && dir !== this.currentDirectory) {
      this._currentDirectory = dir
      this._currentDirectoryPath = this._currentDirectoryPath.slice(
        0,
        this._currentDirectoryPath.length - (steps - stepsMoved),
      )
    }

    return dir
  }

  /**
   * @method goBackToDirectory
   * Navigates to a specific directory
   * @argument {string} dirName directory to navigate to
   * @returns {Directory | null} returns the opened directory
   */
  public goBackToDirectory(dirName: string): Directory | null {
    const dirIndex = this.currentDirectoryPath.lastIndexOf(
      dirName,
      this.currentDirectoryPath.length - 2,
    )

    if (dirIndex < 0) return null

    const dir =
      dirIndex === 0 ? this.root : this._currentDirectoryPath[dirIndex]

    this._currentDirectory = dir
    this._currentDirectoryPath = this._currentDirectoryPath.slice(
      0,
      dirIndex + 1,
    )

    return dir
  }

  /**
   * @method findItem
   * Find a specific item inside the filesystem
   */
  public findItem(
    itemNameOrValidatorFunc: any,
    fromDirectory: Directory = this.root,
  ): any {
    return this.setupAndFind(itemNameOrValidatorFunc, fromDirectory)
  }

  /**
   * @method findAllItems
   * Find a all item inside the filesystem
   */
  public findAllItems(
    itemNameOrValidatorFunc: any,
    fromDirectory: Directory = this.root,
  ): Directory | Item[] | null {
    return this.setupAndFind(itemNameOrValidatorFunc, fromDirectory, true)
  }

  /**
   * @method moveItemTo
   * move an item into a specific directory
   * @argument {string} childName name of item to move
   * @argument {string} dirPath name of directory to move item into
   * @returns {Directory | null} directory the item has been moved to
   */
  public moveItemTo(childName: string, dirPath: string): Directory | null {
    const item = this.getChild(childName)

    if (item) {
      const dir = this.getDirectoryFromPath(dirPath as string)

      if (dir && dir instanceof Directory) {
        dir.addChild(item)
        return dir
      }
    }

    return null
  }

  /**f
   * @method moveItemTo
   * move an item into a specific directory
   * @argument {string} childName name of item to move
   * @argument {string} dirPath name of directory to move item into
   * @returns {Directory | null} directory the item has been moved to
   */
  private _findItem(
    isItem: any,
    dir: Directory,
    multiple: boolean = false,
  ): Item[] | null {
    let match = multiple ? ([] as Item[]) : null
    let directories = []

    for (const item of dir.content) {
      if (isItem(item)) {
        if (multiple !== null) {
          match?.push(item)
        } else {
          match = item
          break
        }
      }

      if (item instanceof Directory)
        directories.push(item)
    }

    if ((match === null || multiple) && directories.length) {
      for (const subDir of directories) {
        const found = this._findItem(isItem, subDir, multiple)
        if (multiple && found !== null) {
          match?.push(...(found as Item[]))
        } else if (found !== null) {
          match = found
          break
        }
      }
    }

    return match
  }


  /**
   * @method setupAndFind
   * Find an item in the filesystem
   */
  private setupAndFind(
    itemNameOrValidatorFunc: string | CallableFunction,
    fromDirectory: Directory,
    multiple?: boolean,
  ): Directory | null | Item[] {
    if (typeof itemNameOrValidatorFunc === 'function') {
      return this._findItem(itemNameOrValidatorFunc, fromDirectory, multiple)
    }

    const func = (item: Item) => item.name === itemNameOrValidatorFunc
    return this._findItem(func, fromDirectory, multiple)
  }

  /**
   * @method setupAndFind
   * Get a directory given a string path to the directory
   * @argument {string} dirPath string path to the directory to get
   * @returns {Directory | null} returns the directory or null if it can't be found
   */
  private getDirectoryFromPath (dirPath: string): Directory | null {
    if (dirPath.match(/^(root\/?|\/)$/g))
      return this.root

    if (dirPath.match(/^\.\/?$/g))
      return this.currentDirectory

    let dir = dirPath.match(/^(root\/?|\/)/g)
      ? this.root
      : this.currentDirectory
    const paths = dirPath.replace(/^(root\/|\.\/|\/)/g, '').split('/')

    while (paths.length) {
      dir = dir.getChild(paths.shift() as string) as Directory

      if (!dir || !(dir instanceof Directory))
        return null
    }

    if (paths.length === 0)
      return dir

    return null
  }
}
