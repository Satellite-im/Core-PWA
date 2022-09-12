import { IridiumDocument, IridiumMessage } from '@satellite-im/iridium'
import { Bus, BusListeners, BusOptions } from '~/libraries/WebRTC/bus/bus'
import Emitter from '~/libraries/WebRTC/Emitter'
import iridium from '~/libraries/Iridium/IridiumManager'

export class IridiumBus
  extends Emitter<BusListeners<IridiumMessage<IridiumDocument>>>
  implements Bus<IridiumMessage<IridiumDocument>, { recipients: string[] }>
{
  private _channel: string
  type: string = 'iridium_pubsub'

  constructor(channel: string) {
    super()

    this._channel = channel

    iridium.connector?.subscribe(this._channel, {
      handler: this.onMessage.bind(this),
      sync: true,
    })
  }

  onMessage(message: IridiumMessage<IridiumDocument>) {
    if (message.payload.body.type === 'signal') {
      return this.emit('signal', {
        type: this.type,
        from: message.from.toString(),
        signalData: message.payload.body.data,
      })
    }

    this.emit('message', { type: this.type, message })
  }

  sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {
    return Promise.all(
      opts.recipients.map((did) =>
        iridium.connector?.publish(this._channel, message, {
          encrypt: { recipients: [did] },
        }),
      ),
    )
  }

  destroy() {
    iridium.connector?.off(this._channel, this.onMessage.bind(this))
  }
}
