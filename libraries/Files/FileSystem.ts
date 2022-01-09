import { Directory } from './Directory'
import { DIRECTORY_TYPE } from './types/directory'
import { Fil } from './Fil'
import { Item } from './abstracts/Item.abstract'

class FileSystem {
  private _self = new Directory('root')
  private _currentDirectory = this._self
  private _currentDirectoryPath = [this._currentDirectory] // as stack

  get currentDirectory() {
    return this._currentDirectory
  }

  get currentDirectoryPath(): string[] {
    return this._currentDirectoryPath.map((dir: Directory) => dir.name)
  }

  get root(): Directory {
    return this._self
  }

  get parent(): null {
    return null
  }

  get name(): string {
    return this.root.name
  }

  get copy(): FileSystem {
    const fsCopy = new FileSystem()

    this.root.content.forEach((item) => {
      const itemCopy = item.copy
      itemCopy.name = item.name
      fsCopy.addChild(itemCopy)
    })

    return fsCopy
  }

  get content(): any {
    return this.currentDirectory.content
  }

  public createFile(fileName: string, ...options: any[]) {
    const newFile = new Fil(fileName, ...options)
    const inserted = this.addChild(newFile)
    return inserted ? newFile : null
  }

  public createDirectory(dirName: string, type = DIRECTORY_TYPE.DEFAULT) {
    const newDir = new Directory(dirName, type)
    const inserted = this.currentDirectory.addChild(newDir)
    return inserted ? newDir : null
  }

  public addChild(child: Item): boolean {
    return this.currentDirectory.addChild(child)
  }

  public getChild(childName: string): Directory | Item {
    return this.currentDirectory.getChild(childName)
  }

  public hasChild(childName: string): boolean {
    return this.currentDirectory.hasChild(childName)
  }

  public removeChild(childName: string): boolean {
    return this.currentDirectory.removeChild(childName)
  }

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

  public copyChild(childName: string): Item | null {
    const item = this.getChild(childName) as Fil

    if (item) {
      const itemCopy = item.copy
      this.addChild(itemCopy)
      return itemCopy
    }

    return null
  }

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

  openDirectory(path: string): Directory | null {
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

  goBack(steps = 1): Directory | null {
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

  goBackToDirectory(dirName: string): Directory | null {
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

  findItem(
    itemNameOrValidatorFunc: any,
    fromDirectory: Directory = this.root,
  ): any {
    return this.setupAndFind(itemNameOrValidatorFunc, fromDirectory)
  }

  findAllItems(
    itemNameOrValidatorFunc: any,
    fromDirectory: Directory = this.root,
  ): Directory | Item[] | null {
    return this.setupAndFind(itemNameOrValidatorFunc, fromDirectory, true)
  }

  moveItemTo(childName: string, dirPath: string): Directory | null {
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

  private getDirectoryFromPath = (dirPath: string) => {
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
