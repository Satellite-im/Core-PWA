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
import { FileUpdate } from '~/libraries/Iridium/files/types'
import fileSystem from '~/libraries/Files/FilSystem'
import { ExportItem } from '~/libraries/Files/types/filesystem'
import isNSFW from '~/utilities/NSFW'
import createThumbnail from '~/utilities/Thumbnail'
import blobToBase64 from '~/utilities/BlobToBase64'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export type IridiumFilesEvent = {
  at: number
  item: ExportItem
  type: FileUpdate
}

export type IridiumFriendPubsub = IridiumPeerMessage<IridiumFilesEvent>

export default class FilesManager extends Emitter<IridiumFriendPubsub> {
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
    const pubsub = await iridium.ipfs.pubsub.ls()
    logger.info('iridium/files', 'pubsub', pubsub)
    await this.fetch()
    logger.log('iridium/files', 'files state loaded', this.state)
    logger.info('iridium/files', 'subscribing to announce topic')
    await iridium.subscribe('/files/announce')
    this.iridium.connector?.on(
      '/files/announce',
      this.onFilesActivity.bind(this),
    )
    logger.log('iridium/files', 'listening for friend activity', this.state)

    // if (this.state.content) {
    //   await fileSystem.import(this.state.content)
    // }

    this.emit('ready', {})
  }

  async stop() {
    await this.iridium.connector?.unsubscribe(`/friends/announce`)
  }

  async fetch() {
    this.state = await this.get('/')
    this.lastUpdated = Date.now()
  }

  private async onFilesActivity(
    message: IridiumPeerMessage<IridiumFilesEvent>,
  ) {
    const { payload } = message
    const { at, item, type } = payload
    logger.info('iridium/files', type, {
      at,
      item,
    })
    // update local if remote change. compare local lastUpdated to incoming `at` (timestamp)
  }

  get(path: string, options: IridiumGetOptions = {}) {
    return this.iridium.connector?.get(
      `/files${path === '/' ? '' : path}`,
      options,
    )
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
    return this.iridium.connector?.broadcast(`/files/announce`, event)
  }

  public async personalUpload(file: File) {
    const nsfw = await isNSFW(file)
    const res = await this.upload({ file })
    const thumbnail = await createThumbnail(file, 400)

    fileSystem.createFile({
      id: res?.path,
      name: file.name,
      size: file.size,
      type: Object.values(FILE_TYPE).includes(file.type as FILE_TYPE)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnail ? await blobToBase64(thumbnail) : '',
      nsfw,
    })
  }

  private async upload({
    file,
    options,
  }: {
    file: File
    options?: AddOptions
  }) {
    return await (this.iridium.connector?.ipfs as IPFS).add(file, options)
  }

  // not yet implemented. switch upload to stream based rather than using a blob
  private getStream(file: File) {
    // @ts-ignore
    const reader = file.stream().getReader()
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          return reader
            .read()
            .then(({ done, value }: { done: boolean; value: Uint8Array }) => {
              if (done) {
                controller.close()
                return
              }
              controller.enqueue(value)
              push()
            })
        }
        push()
      },
    })
    return stream
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
