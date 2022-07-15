import { Emitter } from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IPFS } from 'ipfs-core-types'
import type { AddOptions, AddResult } from 'ipfs-core-types/root'
import { createWriteStream } from 'streamsaver'
import { v4 as uuidv4 } from 'uuid'
import type { IridiumManager } from '../IridiumManager'
import logger from '~/plugins/local/logger'
import { IridiumDirectory, IridiumItem } from '~/libraries/Iridium/files/types'
import isNSFW from '~/utilities/NSFW'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToStream } from '~/utilities/BlobManip'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { Config } from '~/config'
import { FileSystemErrors } from '~/libraries/Files/errors/Errors'
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'

export default class FilesManager extends Emitter {
  public readonly iridium: IridiumManager
  public lastUpdated: number = 0 // local, will be used to update the delta after remote operations
  public state: { items: IridiumItem[] } = { items: [] }

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  async init() {
    if (!this.iridium.connector) {
      throw new Error('cannot initialize files, no iridium connector')
    }

    const iridium = this.iridium.connector
    logger.log('iridium/files', 'initializing')
    await this.fetch()
    logger.log('iridium/files', 'files state loaded', this.state)
    await iridium.subscribe('/files/announce')

    this.emit('ready', {})
  }

  async fetch() {
    const res = await this.iridium.connector?.get('/files')
    if ('items' in res) {
      this.state = res
    }
    this.lastUpdated = Date.now()
  }

  get(path: string = '', options: IridiumGetOptions = {}) {
    return this.iridium.connector?.get(`/files${path}`, options)
  }

  set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info('iridium/files', 'path and payload', {
      path,
      payload,
    })
    return this.iridium.connector?.set(
      `/files${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  /**
   * @description Create directory in state for file structure
   * @param {string} name directory name
   * @param {string} parentId attach id to each item so the parent can be found later in case of rename operation
   */
  addDirectory(name: string, parentId: string) {
    const parent = this.flat.find((e) => e.id === parentId) as
      | IridiumDirectory
      | undefined
    this.validateName(name, parent)

    const target = parent?.children ?? this.state.items
    target.push({
      id: uuidv4(), // since directories wont exist remotely, use uuid rather than CID
      name,
      liked: false,
      shared: false,
      modified: Date.now(),
      children: [],
      type: DIRECTORY_TYPE.DEFAULT,
      size: 0,
      parentId,
    })
    this.set('/items', this.state.items)
  }

  /**
   * @description Process file, push to ipfs, and store information in state
   * @param {File} file file to be uploaded
   * @param {string} parentId attach id to each item so the parent can be found later in case of rename operation
   */
  async addFile({
    file,
    parentId,
    options,
  }: {
    file: File
    parentId: string
    options?: AddOptions
  }) {
    const parent = this.flat.find((e) => e.id === parentId) as
      | IridiumDirectory
      | undefined
    this.validateName(file.name, parent)
    const thumbnailBlob = await createThumbnail(file, 400)

    const target = parent?.children ?? this.state.items
    target.push({
      id: (await this.upload(file, options)).path,
      name: file.name,
      size: file.size,
      nsfw: await isNSFW(file),
      liked: false,
      shared: false,
      parentId,
      modified: Date.now(),
      type: Object.values(FILE_TYPE).includes(file.type as FILE_TYPE)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnailBlob
        ? (await this.upload(thumbnailBlob, options)).path
        : '',
      extension: file.name
        .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
        .toLowerCase(),
    })
    this.set('/items', this.state.items)
  }

  /**
   * @description push file to ipfs
   * @param {Blob} file
   * @param {AddOptions} options
   */
  async upload(file: Blob, options?: AddOptions): Promise<AddResult> {
    return await (this.iridium.connector?.ipfs as IPFS).add(
      blobToStream(file),
      options,
    )
  }

  /**
   * @description unpin file from ipfs and remove from file system index
   * @param {IridiumItem} item
   */
  removeItem(item: IridiumItem) {
    // if file, unpin from ipfs
    if ('thumbnail' in item) {
      // TODO - confirm this actually works when we can connect to ipfs
      this.iridium.connector?.ipfs.pin.rm(item.id)
    }
    // if root item
    if (!item.parentId) {
      const index = this.state.items.indexOf(item)
      this.state.items.splice(index, 1)
      this.set('/items', this.state.items)
      return
    }
    const parent = this.flat.find((e) => e.id === item.parentId) as
      | IridiumDirectory
      | undefined
    if (!parent) {
      return
    }
    const index = parent.children.indexOf(item)
    if (index > -1) {
      parent.children.splice(index, 1)
    }
    this.set('/items', this.state.items)
  }

  /**
   * @description update item properties based on optional params
   * @param {IridiumItem} item
   * @param {string} name potential new name
   * @param {boolean} liked new liked status
   */
  updateItem({
    item,
    name,
    liked,
  }: {
    item: IridiumItem
    name?: string
    liked?: boolean
  }) {
    if (!item) {
      return
    }
    if (name !== undefined) {
      const parent = this.flat.find((e) => e.id === item.parentId) as
        | IridiumDirectory
        | undefined
      this.validateName(name, parent)
      item.name = name
    } else if (liked !== undefined) {
      item.liked = liked
    }
    this.set('/items', this.state.items)
  }

  /**
   * @description fetch file from ipfs and download with streamsaver
   * @param {string} path file cid
   * @param {string} name file name
   * @param {number} size file size to show progress in browser
   */
  async download(path: string, name: string, size: number) {
    const fileStream = createWriteStream(name, { size })
    const writer = fileStream.getWriter()

    window.onunload = () => writer.abort()

    for await (const bytes of (this.iridium.connector?.ipfs as IPFS).cat(path, {
      length: size,
    })) {
      writer.write(bytes)
    }
    writer.close()
  }

  /**
   * @description fetch thumbnail from ipfs and return as blob
   * @param {string} path thumbnail cid
   * @returns {Promise<Blob>}
   */
  async fetchThumbnail(path: string, type?: FILE_TYPE): Promise<Blob> {
    const data = []
    for await (const bytes of (this.iridium.connector?.ipfs as IPFS).cat(
      path,
    )) {
      data.push(bytes)
    }
    return new Blob(data, { type })
  }

  /**
   * @returns {IridiumItem[]} flattened list of items
   */
  get flat(): IridiumItem[] {
    return this.flatDeep(this.state.items)
  }

  /**
   * @returns {number} total size of all tracked files
   */
  get totalSize(): number {
    return this.flat.reduce((total, curr) => total + curr.size, 0)
  }

  /**
   * @returns {number} percentage of available storage used
   */
  get percentStorageUsed(): number {
    return (this.totalSize / Config.personalFilesLimit) * 100
  }

  /**
   * @param {string} name new item name
   * @param {IridiumDirectory} parent empty string if root element
   */
  private validateName(name: string, parent?: IridiumDirectory) {
    if (Config.regex.empty.test(name)) {
      throw new Error(FileSystemErrors.NO_EMPTY_STRING)
    }

    if (name[0] === '.') {
      throw new Error(FileSystemErrors.LEADING_DOT)
    }

    if (Config.regex.invalid.test(name)) {
      throw new Error(FileSystemErrors.INVALID)
    }

    // if no parent, look at root, otherwise look at sibling items
    this.isDuplicateName(name, !parent ? this.state.items : parent.children)
  }

  /**
   * @param {string} name new item name
   * @param {IridiumItem[]} items list of items to compare
   */
  private isDuplicateName(name: string, items: IridiumItem[]) {
    items.forEach((e) => {
      if (!e.name.localeCompare(name, undefined, { sensitivity: 'base' })) {
        throw new Error(FileSystemErrors.DUPLICATE_NAME)
      }
    })
  }

  /**
   * @description recursively flattens all directories
   * @param {IridiumItem[]} list current directory items (starting with root, then calls itself when a nested dir is found)
   * @returns {IridiumItem[]} flattened list of files and directories
   */
  private flatDeep(list: IridiumItem[]): IridiumItem[] {
    return list.reduce((prev: IridiumItem[], curr) => {
      prev.push(curr)
      if ('children' in curr) {
        prev.push(...this.flatDeep(curr.children))
      }
      return prev
    }, [])
  }
}
