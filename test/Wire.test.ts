import { Wire } from '../libraries/WebRTC/Wire'

describe('Test class Wire', () => {

it('Wire-destroy', () => {
// Arguments
const originator1 = 'Oha'
const identifier1 = 'Oha'
const channel1 = 'Oha'
const announceURLs1 = undefined!
const sendIdentification1 = undefined!

// Method call
const wire = new Wire(originator1, identifier1, channel1, announceURLs1, sendIdentification1)
 wire.destroy()
})

it('Wire-send', () => {
// Arguments
const originator2 = 'Oha'
const identifier2 = 'Oha'
const channel2 = 'Oha'
const announceURLs2 = undefined!
const sendIdentification2 = undefined!
const message1 = undefined!

// Method call
const wire = new Wire(originator2, identifier2, channel2, announceURLs2, sendIdentification2)
 wire.send(message1)
})

it('Wire-originator', () => {
// Arguments
const originator3 = 'Oha'
const identifier3 = 'Oha'
const channel3 = 'Oha'
const announceURLs3 = undefined!
const sendIdentification3 = undefined!
const originator4 = 'Oha'

// Property call
const wire = new Wire(originator3, identifier3, channel3, announceURLs3, sendIdentification3)
wire.originator = originator4
const result = wire.originator

// Expect result
expect(result).toEqual(originator4)
})

it('Wire-identifier', () => {
// Arguments
const originator5 = 'Oha'
const identifier4 = 'Oha'
const channel4 = 'Oha'
const announceURLs4 = undefined!
const sendIdentification4 = undefined!
const identifier5 = 'Oha'

// Property call
const wire = new Wire(originator5, identifier4, channel4, announceURLs4, sendIdentification4)
wire.identifier = identifier5
const result = wire.identifier

// Expect result
expect(result).toEqual(identifier5)
})

it('Wire-channel', () => {
// Arguments
const originator6 = 'Oha'
const identifier6 = 'Oha'
const channel5 = 'Oha'
const announceURLs5 = undefined!
const sendIdentification5 = undefined!
const channel6 = 'Oha'

// Property call
const wire = new Wire(originator6, identifier6, channel5, announceURLs5, sendIdentification5)
wire.channel = channel6
const result = wire.channel

// Expect result
expect(result).toEqual(channel6)
})

it('Wire-sendIdentification', () => {
// Arguments
const originator7 = 'Oha'
const identifier7 = 'Oha'
const channel7 = 'Oha'
const announceURLs6 = undefined!
const sendIdentification6 = undefined!
const sendIdentification7 = undefined!

// Property call
const wire = new Wire(originator7, identifier7, channel7, announceURLs6, sendIdentification6)
wire.sendIdentification = sendIdentification7
const result = wire.sendIdentification

// Expect result
expect(result).toEqual(sendIdentification7)
})

it('Wire-instance', () => {
// Arguments
const originator8 = 'Oha'
const identifier8 = 'Oha'
const channel8 = 'Oha'
const announceURLs7 = undefined!
const sendIdentification8 = undefined!
const instance1 = undefined!

// Property call
const wire = new Wire(originator8, identifier8, channel8, announceURLs7, sendIdentification8)
wire.instance = instance1
const result = wire.instance

// Expect result
expect(result).toEqual(instance1)
})

it('Wire-peer', () => {
// Arguments
const originator9 = 'Oha'
const identifier9 = 'Oha'
const channel9 = 'Oha'
const announceURLs8 = undefined!
const sendIdentification9 = undefined!
const peer1 = undefined!

// Property call
const wire = new Wire(originator9, identifier9, channel9, announceURLs8, sendIdentification9)
wire.peer = peer1
const result = wire.peer

// Expect result
expect(result).toEqual(peer1)
})

})
