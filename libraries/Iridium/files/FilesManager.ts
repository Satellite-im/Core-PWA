import { Emitter } from '@satellite-im/iridium'
import type {
  IridiumPeerMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IPFS } from 'ipfs-core-types'
import type { AddOptions } from 'ipfs-core-types/root'
import { createWriteStream } from 'streamsaver'
import type { IridiumManager } from '../IridiumManager'
import logger from '~/plugins/local/logger'
import { FileUpdate, ExportItem } from '~/libraries/Iridium/files/types'
import fileSystem from '~/libraries/Files/FilSystem'
import isNSFW from '~/utilities/NSFW'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToStream, blobToBase64 } from '~/utilities/BlobManip'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export type IridiumFilesEvent = {
  at: number
  item: ExportItem
  type: FileUpdate
}

export default class FilesManager extends Emitter {
  public readonly iridium: IridiumManager
  public lastUpdated: number = 0 // local, will be used to update the delta after remote operations
  public state: {
    content?: ExportItem[]
  } = {}

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
    this.iridium.connector?.on(
      '/files/announce',
      this.onFilesActivity.bind(this),
    )

    if (this.state.content) {
      await fileSystem.import(this.state.content)
    }

    this.emit('ready', {})
  }

  async fetch() {
    this.state = (await this.iridium.connector?.get('/files')) || {
      content: [],
    }
    this.lastUpdated = Date.now()
  }

  private async onFilesActivity(
    message: IridiumPeerMessage<IridiumFilesEvent>,
  ) {
    console.log('files activity')
    const { payload } = message
    const { at, item, type } = payload
    logger.info('iridium/files', type, {
      at,
      item,
    })
    // update local if remote change. compare local lastUpdated to incoming `at` (timestamp)
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

  broadcast(event: IridiumFilesEvent) {
    return this.iridium.connector?.broadcast('/files/announce', event)
  }

  async personalUpload(file: File) {
    const nsfw = await isNSFW(file)
    const res = await this.upload({ file })
    const thumbnailBlob = await createThumbnail(file, 400)

    const {
      id,
      name,
      liked,
      shared,
      type,
      modified,
      size,
      description,
      extension,
      thumbnail,
    } = fileSystem.createFile({
      id: res?.path,
      name: file.name,
      size: file.size,
      type: Object.values(FILE_TYPE).includes(file.type as FILE_TYPE)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnailBlob ? await blobToBase64(thumbnailBlob) : '',
      nsfw,
    })
    // this.broadcast({
    //   at: Date.now(),
    //   item: {
    //     id,
    //     name,
    //     liked,
    //     shared,
    //     type,
    //     modified,
    //     size,
    //     description,
    //     extension,
    //     thumbnail,
    //     nsfw,
    //   },
    //   type: 'upload',
    // })
  }

  exportFs() {
    this.set('/content', fileSystem.export)
  }

  async upload({ file, options }: { file: File; options?: AddOptions }) {
    return await (this.iridium.connector?.ipfs as IPFS).add(
      blobToStream(file),
      options,
    )
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
}
