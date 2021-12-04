import { Call } from './Call'
import { Wire } from './Wire'

export class Peer {
  identifier: string // identifier of the user to connect with
  communicationBus: Wire
  call: Call

  constructor(
    originator: string,
    identifier: string,
    channel: string,
    announceUrls: string[] = [],
  ) {
    this.identifier = identifier

    this.communicationBus = new Wire(
      originator,
      identifier,
      channel,
      announceUrls,
      true,
    )

    this.call = new Call(this.communicationBus)
  }
}
