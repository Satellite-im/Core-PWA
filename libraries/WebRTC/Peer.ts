import SimplePeer from 'simple-peer'

export default class Peer extends SimplePeer {
  groupId: string
  did: string
  constructor(groupId: string, did: string, options: SimplePeer.Options) {
    super(options)
    this.groupId = groupId
    this.did = did
  }
}
