import { Emitter } from '@satellite-im/iridium'
import type {
  IridiumMessage,
  IridiumChannelEvent,
  IridiumDocument,
  IridiumGetOptions,
  IridiumPayload,
  IridiumPeerMessage,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import { GroupData, GroupsError } from '~/libraries/Iridium/groups/types'

export default class Group extends Emitter<IridiumMessage> {
  constructor(
    public readonly id: string,
    private readonly iridium: IridiumManager,
    private state?: GroupData,
  ) {
    super()
  }

  get name() {
    return this.state?.name
  }

  get members() {
    return this.state?.members
  }

  static async getById(id: string, iridium: IridiumManager) {
    const group = new Group(id, iridium)
    await group.load()
    return group
  }

  async load() {
    if (!this.iridium.connector) {
      throw new Error(GroupsError.GROUP_NOT_INITIALIZED)
    }

    this.state = await this.iridium.connector?.get(`/groups/${this.id}`)
    this.iridium.connector.on(`/groups/${this.id}`, this._onWireMessage)
    await this.iridium.connector.subscribe(`/groups/${this.id}`)
  }

  private _onWireMessage(message: IridiumPeerMessage<IridiumChannelEvent>) {
    const { from, payload } = message
    const { channel, data } = payload
    this.emit(channel, { from, data, payload })
  }

  assertReady() {
    if (!this.state?.members) {
      throw new Error(GroupsError.GROUP_NOT_INITIALIZED)
    }
  }

  sendChatMessage(message: ConversationMessage) {
    return this.iridium.chat?.sendMessage(this.id, message)
  }

  send(payload: ConversationMessage) {
    if (!this.state?.members) {
      throw new Error(GroupsError.GROUP_NOT_INITIALIZED)
    }

    console.info('sending group message')
    return this.iridium.connector?.send(payload, {
      to: this.state?.members,
    })
  }

  broadcast<T = IridiumDocument | string>(channel: string, data: T) {
    this.assertReady()
    return this.iridium.connector?.broadcast(
      `/groups/${this.id}`,
      { channel, data },
      { encrypt: { recipients: this.state?.members } },
    )
  }

  async set(
    key: string,
    payload: IridiumPayload,
    options: IridiumSetOptions = {},
  ) {
    this.assertReady()

    if (!options.store) {
      options.store = {}
    }
    if (!options.store.encrypt) {
      options.store.encrypt = {}
    }
    options.store.encrypt.recipients = this.state?.members // TODO: to be fixed
    return this.iridium.connector?.set(
      `/groups/${this.id}/${key}`,
      payload,
      options,
    )
  }

  async get(key: string, options?: IridiumGetOptions) {
    this.assertReady()
    return this.iridium.connector?.get(`/groups/${this.id}/${key}`, options)
  }
}
