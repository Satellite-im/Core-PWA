import EventEmitter from 'events'
import Peer from 'simple-peer'

type TrackerStats = {
  connected: number
  total: number
}

type WebTorrentEventType =
  | 'trackerconnect'
  | 'peerconnect'
  | 'connect'
  | 'error'
  | 'data'
  | 'track'
  | 'stream'
  | 'close'

export default class P2PT extends EventEmitter {
  announceURLs: string[]
  trackers: { [key: string]: any }
  peers: { [key: string]: Peer.Instance }
  msgChunks: { [key: string]: any }
  responseWaiting: { [key: string]: any }

  _peerIdBuffer: Buffer
  _peerId: string
  _peerIdBinary: string

  identifierString?: string
  infoHash?: string
  _infoHashBuffer?: Buffer
  _infoHashBinary?: string

  constructor(announceURLs: string[], identifierString: string)
  setIdentifier: (identifierString: string) => void
  start: () => void
  addTracker: (announceURL: string) => void
  removeTracker: (announceURL: string) => void
  send: (peer: Peer.Instance, msg: {}, msgID: string) => Promise<[any, any]>
  requestMorePeers: () => Promise<Peer.Instance[]>
  getTrackerStats: () => TrackerStats
  destroy: () => void
}
