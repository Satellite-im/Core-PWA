import { Emitter } from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IPFS } from 'ipfs-core-types'
import type { AddOptions } from 'ipfs-core-types/root'
import { createWriteStream } from 'streamsaver'
import { v4 as uuidv4 } from 'uuid'
import type { IridiumManager } from '../IridiumManager'
import logger from '~/plugins/local/logger'
import { IridiumDirectory, IridiumItem } from '~/libraries/Iridium/files/types'
import isNSFW from '~/utilities/NSFW'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToStream, blobToBase64 } from '~/utilities/BlobManip'
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
  }

  /**
   * @description Process file, push to ipfs, and store information in state
   * @param {File} file file to be uploaded
   * @param {string} parentId attach id to each item so the parent can be found later in case of rename operation
   */
  async addFile(file: File, parentId: string) {
    const parent = this.flat.find((e) => e.id === parentId) as
      | IridiumDirectory
      | undefined
    this.validateName(file.name, parent)
    const res = await (this.iridium.connector?.ipfs as IPFS).add(
      blobToStream(file),
    )
    const thumbnailBlob = await createThumbnail(file, 400)

    const target = parent?.children ?? this.state.items
    target.push({
      id: res?.path,
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
      // TODO- maybe store thumbnail blob in ipfs as second object, then store hash here and lazy load
      thumbnail: thumbnailBlob ? await blobToBase64(thumbnailBlob) : '',
      extension: file.name
        .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
        .toLowerCase(),
    })
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

    // if root directory
    if (!parent) {
      this.isDuplicateName(name)
      return
    }
    // else, look inside children of current parent item
    this.isDuplicateName(name, parent.children)
  }

  /**
   * @param {string} name new item name
   * @param {IridiumItem[]} items default to root, sibling items will be provided for nested items
   */
  private isDuplicateName(
    name: string,
    items: IridiumItem[] = this.state.items,
  ) {
    items.forEach((e) => {
      if (!e.name.localeCompare(name, undefined, { sensitivity: 'base' })) {
        throw new Error(FileSystemErrors.DUPLICATE_NAME)
      }
    })
  }

  updateItem({
    id,
    name,
    liked,
    parentId,
  }: {
    id: string
    name?: string
    liked?: boolean
    parentId: string
  }) {
    const item = this.flat.find((e) => e.id === id)
    if (!item) {
      return
    }
    if (name !== undefined) {
      const parent = this.flat.find((e) => e.id === parentId) as
        | IridiumDirectory
        | undefined
      this.validateName(name, parent)
      item.name = name
    } else if (liked !== undefined) {
      item.liked = liked
    }
  }

  /**
   * @method download
   * @description fetch file from ipfs and download with streamsaver
   * @param {string} path file path in bucket
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

  get flat(): IridiumItem[] {
    return this.flatDeep(this.state.items)
  }

  private flatDeep(list: IridiumItem[]): IridiumItem[] {
    return list.reduce((prev: IridiumItem[], el) => {
      prev.push(el)
      if ('children' in el) {
        prev.push(...this.flatDeep(el.children))
      }
      return prev
    }, [])
  }
}
