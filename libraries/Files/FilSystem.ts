import { matchSorter } from 'match-sorter'
import { Directory } from './Directory'
import { DIRECTORY_TYPE } from './types/directory'
import { Fil } from './Fil'
import { Item } from './abstracts/Item.abstract'
import {
  FileSystemExport,
  ExportItem,
  FILESYSTEM_TYPE,
  ExportFile,
  ExportDirectory,
} from './types/filesystem'
import { FILE_TYPE } from './types/file'
import { Config } from '~/config'

export class FilSystem {
  private _self = new Directory({ name: 'root' })
  private _currentDirectory = this._self
  private _currentDirectoryPath = [this._currentDirectory] // as stack
  private _version: number = 1

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
   * @returns {FilSystem} Returns a copy of the entire filesystem
   */
  get copy(): FilSystem {
    const fsCopy = new FilSystem()

    this.root.content.forEach((item) => {
      const itemCopy = (item as Directory | Fil).copy
      itemCopy.name = item.name
      fsCopy.addChild(itemCopy)
    })

    return fsCopy
  }

  /**
   * @getter content
   * @returns {Item[]} Returns an array of all content within the CURRENT directory
   */
  get content(): Item[] {
    return this.currentDirectory.content
  }

  /**
   * @getter export
   * @returns {FileSystemExport} returns exported filesystem object
   */
  get export(): FileSystemExport {
    return {
      type: FILESYSTEM_TYPE.DEFAULT,
      version: this._version++,
      content: this.root.content.map((item) => {
        return this.exportChildren(item)
      }),
    }
  }

  /**
   * @method flat
   * @returns {ExportItem[]} flattened list of files in order to check if file exists
   */
  get flat(): ExportItem[] {
    const flatDeepByKey = (
      data: Array<ExportItem | ExportFile>,
      key: keyof ExportDirectory | keyof ExportFile,
    ) => {
      return data.reduce((prev, el) => {
        prev.push(el)
        if (el[key]) {
          prev.push(...flatDeepByKey(el[key], key))
        }
        return prev
      }, [])
    }
    return flatDeepByKey(this.export.content, 'children')
  }

  /**
   * @method totalSize
   * @returns {number} total size of all tracked files
   */
  get totalSize(): number {
    return this.flat.reduce(
      (total, curr) =>
        (Object.values(FILE_TYPE) as string[]).includes(curr.type)
          ? total + (curr as ExportFile).size
          : total,
      0,
    )
  }

  /**
   * @method percentStorageUsed
   * @returns {number} percentage of available storage used
   */
  get percentStorageUsed(): number {
    return (this.totalSize / Config.personalFilesLimit) * 100
  }

  /**
   * @method exportChildren
   * @param {Item} item
   * @description recursively converts item to the proper format for export
   * @returns {ExportItem} Item in ExportItem format
   */
  exportChildren(item: Item): ExportItem {
    if (item instanceof Fil) {
      const {
        id,
        name,
        liked,
        shared,
        type,
        path,
        size,
        description,
        modified,
        thumbnail,
      } = item
      return {
        id,
        name,
        liked,
        shared,
        type,
        path,
        size,
        description,
        modified,
        thumbnail,
      }
    }
    const { id, name, liked, shared, type, modified } = item

    return {
      id,
      name,
      liked,
      shared,
      type,
      modified,
      children: (item as Directory).content.map((item) => {
        return this.exportChildren(item)
      }),
    }
  }

  /**
   * @method import
   * @param {FileSystemExport} fs
   * @description sets global file system based on parameter. will be fetched from Bucket
   */
  public async import(fs: FileSystemExport) {
    for (const item of fs.content) {
      await this.importChildren(item)
    }
    this._version = fs.version
  }

  /**
   * @method importChildren
   * @param {ExportItem} item
   * @description recursively adds files and directories from JSON export
   */
  public async importChildren(item: ExportItem) {
    if ((Object.values(FILE_TYPE) as string[]).includes(item.type)) {
      const {
        id,
        name,
        size,
        liked,
        shared,
        description,
        modified,
        thumbnail,
      } = item as ExportFile
      const type = item.type as FILE_TYPE
      this.createFile({
        id,
        name,
        size,
        liked,
        shared,
        description,
        type,
        modified,
        thumbnail,
      })
    }
    if ((Object.values(DIRECTORY_TYPE) as string[]).includes(item.type)) {
      const { id, name, liked, shared, children, modified } =
        item as ExportDirectory
      const type = item.type as DIRECTORY_TYPE
      this.createDirectory({ id, name, liked, shared, type, modified })
      this.openDirectory(name)
      for (const item of children) {
        await this.importChildren(item)
      }
      this.goBack()
    }
  }

  /**
   * @method createFile
   * @param {object} param0 object containing file information
   * @returns {Fil | null} Returns the new file if successfully created, else null
   */
  public createFile({
    id,
    name,
    file,
    size,
    liked,
    shared,
    description,
    type,
    modified,
    thumbnail,
  }: {
    id: string
    name: string
    file?: File
    size: number
    liked?: boolean
    shared?: boolean
    description?: string
    type?: FILE_TYPE
    modified?: number
    thumbnail?: string
  }): Fil | null {
    const newFile = new Fil({
      id,
      name,
      file,
      size,
      liked,
      shared,
      description,
      type,
      modified,
      thumbnail,
    })
    const inserted = this.addChild(newFile)
    return inserted ? newFile : null
  }

  /**
   * @method createDirectory
   * @argument {string} dirName name of the new directory to create
   * @argument {type} DIRECTORY_TYPE Default for now
   * @returns {Directory | null} Returns the new directory if successfully created, else null
   */
  public createDirectory({
    id,
    name,
    liked,
    shared,
    type,
    modified,
  }: {
    id: string
    name: string
    liked?: boolean
    shared?: boolean
    type?: DIRECTORY_TYPE
    modified?: number
  }): Directory | null {
    const newDir = new Directory({ id, name, liked, shared, type, modified })
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
  public getChild(childName: string): Item {
    return this.currentDirectory.getChild(childName)
  }

  /**
   * @method hasChild
   * @argument {string} childName name of the child to check for
   * @returns {boolean} returns truthy if child by name exists in filesystem
   */
  public hasChild(childName: string): boolean {
    return this.flat.some((item) => item.name === childName)
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
   * @argument {string} currentName name of the child to remove
   * @argument {string} newName
   * @returns {Item | null} returns new item or null if no item exists
   */
  public renameChild(currentName: string, newName: string): Item | null {
    const item = this.getChild(currentName)
    if (!item) {
      return null
    }

    item.name = newName
    this.removeChild(currentName)
    this.addChild(item)
    return item
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
   * @method openDirectory
   * This will navigate the filesystem to the directory at this path
   * @argument {string} path path to navigate to
   * @returns {Directory | null} returns the opened directory
   */
  public openDirectory(path: string): Directory | null {
    if (!path) return null

    const dir = this.getDirectoryFromPath(path as string)
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
   * @method fuzzySearch
   * search the file or folders from file system
   * @argument {string} partial search value
   */
  public fuzzySearch(partial: string): Item[] {
    const itemList: Item[] = this.findAllItems(this.checkString, this.root)
    return matchSorter(itemList, partial, { keys: ['_name', '_type'] })
  }

  checkString(item: Item): boolean {
    return item.name.includes('')
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

  /**
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
    const directories = []

    for (const item of dir.content) {
      if (isItem(item)) {
        if (multiple !== null) {
          match?.push(item)
        } else {
          match = item
          break
        }
      }

      if (item instanceof Directory) directories.push(item)
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
   * @method getDirectoryFromPath
   * Get a directory given a string path to the directory
   * @argument {string} dirPath string path to the directory to get
   * @returns {Directory | null} returns the directory or null if it can't be found
   */
  private getDirectoryFromPath(dirPath: string): Directory | null {
    if (dirPath.match(/^(root\/?|\/)$/g)) return this.root

    if (dirPath.match(/^\.\/?$/g)) return this.currentDirectory

    let dir = dirPath.match(/^(root\/?|\/)/g)
      ? this.root
      : this.currentDirectory
    const paths = dirPath.replace(/^(root\/|\.\/|\/)/g, '').split('/')

    while (paths.length) {
      dir = dir.getChild(paths.shift() as string) as Directory

      if (!dir || !(dir instanceof Directory)) return null
    }

    if (paths.length === 0) return dir

    return null
  }
}
