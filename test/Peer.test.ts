import { Peer } from '../libraries/WebRTC/Peer'

describe('Test class Peer', () => {

it('Peer-send', () => {
// Arguments
const originator1 = 'Oha'
const identifier1 = 'Oha'
const channel1 = 'Oha'
const announceUrls1 = undefined!
const type1 = undefined!
const data1 = undefined!

// Method call
const peer = new Peer(originator1, identifier1, channel1, announceUrls1)
 peer.send(type1, data1)
})

it('Peer-identifier', () => {
// Arguments
const originator2 = 'Oha'
const identifier2 = 'Oha'
const channel2 = 'Oha'
const announceUrls2 = undefined!
const identifier3 = 'Oha'

// Property call
const peer = new Peer(originator2, identifier2, channel2, announceUrls2)
peer.identifier = identifier3
const result = peer.identifier

// Expect result
expect(result).toEqual(identifier3)
})

it('Peer-communicationBus', () => {
// Arguments
const originator3 = 'Oha'
const identifier4 = 'Oha'
const channel3 = 'Oha'
const announceUrls3 = undefined!
const communicationBus1 = undefined!

// Property call
const peer = new Peer(originator3, identifier4, channel3, announceUrls3)
peer.communicationBus = communicationBus1
const result = peer.communicationBus

// Expect result
expect(result).toEqual(communicationBus1)
})

it('Peer-call', () => {
// Arguments
const originator4 = 'Oha'
const identifier5 = 'Oha'
const channel4 = 'Oha'
const announceUrls4 = undefined!
const call1 = undefined!

// Property call
const peer = new Peer(originator4, identifier5, channel4, announceUrls4)
peer.call = call1
const result = peer.call

// Expect result
expect(result).toEqual(call1)
})

})
