import { Emitter } from '@satellite-im/iridium/src/emitter'
import type {
  IridiumPeerMessage,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import type { IPFS } from 'ipfs-core-types'
import { createWriteStream } from 'streamsaver'
import type { IridiumManager } from '../IridiumManager'
import logger from '~/plugins/local/logger'
import { ExportItem, FileUpdate } from '~/libraries/Iridium/files/types'
import fileSystem from '~/libraries/Files/FilSystem'
import { Fil } from '~/libraries/Files/Fil'

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

    if (this.state.content) {
      fileSystem.import(this.state.content)
    }

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

  async upload({
    file,
    options,
  }: {
    file: File
    // todo improve type notation after we import iridium as package
    options?: any
  }) {
    return await (this.iridium.connector.ipfs as IPFS).add(file)
  }

  // not yet implemented. switch upload to stream based rather than using a blob
  private _getStream(file: File) {
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

  async download(file: Fil) {
    // if user removed extension or switched to invalid, add proper extension back
    const fileExt = file.name
      .slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLowerCase()
    const name =
      file.extension === fileExt ? file.name : `${file.name}.${file.extension}`

    const fileStream = createWriteStream(name, { size: file.size })
    const writer = fileStream.getWriter()

    window.onunload = () => writer.abort()

    for await (const bytes of (this.iridium.connector.ipfs as IPFS).cat(
      file.id,
      { length: file.size },
    )) {
      writer.write(bytes)
    }
    writer.close()
  }
}
