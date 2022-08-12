import SimplePeer from 'simple-peer'

export default class Peer extends SimplePeer {
  constructor(groupId: string, peerId: string, options: any) {
    super(options)
    this.groupId = groupId
    this.peerId = peerId
  }
}
