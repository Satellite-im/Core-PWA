import { Call } from '../libraries/WebRTC/Call'

describe('Test class Call', () => {

it('Call-start', () => {
// Arguments
const communicationBus1 = undefined!
const stream1 = undefined!

// Method call
const call = new Call(communicationBus1)
 call.start(stream1)
})

it('Call-answer', () => {
// Arguments
const communicationBus2 = undefined!
const stream2 = undefined!

// Method call
const call = new Call(communicationBus2)
 call.answer(stream2)
})

it('Call-hangUp', () => {
// Arguments
const communicationBus3 = undefined!

// Method call
const call = new Call(communicationBus3)
 call.hangUp()
})

it('Call-addStream', () => {
// Arguments
const communicationBus4 = undefined!
const stream3 = undefined!

// Method call
const call = new Call(communicationBus4)
 call.addStream(stream3)
})

it('Call-removeStream', () => {
// Arguments
const communicationBus5 = undefined!
const stream4 = undefined!

// Method call
const call = new Call(communicationBus5)
 call.removeStream(stream4)
})

it('Call-addTrack', () => {
// Arguments
const communicationBus6 = undefined!
const track1 = undefined!
const stream5 = undefined!

// Method call
const call = new Call(communicationBus6)
 call.addTrack(track1, stream5)
})

it('Call-removeTrack', () => {
// Arguments
const communicationBus7 = undefined!
const track2 = undefined!
const stream6 = undefined!

// Method call
const call = new Call(communicationBus7)
 call.removeTrack(track2, stream6)
})

it('Call-replaceTrack', () => {
// Arguments
const communicationBus8 = undefined!
const oldTrack1 = undefined!
const newTrack1 = undefined!
const stream7 = undefined!

// Method call
const call = new Call(communicationBus8)
 call.replaceTrack(oldTrack1, newTrack1, stream7)
})

it('Call-communicationBus', () => {
// Arguments
const communicationBus9 = undefined!
const communicationBus10 = undefined!

// Property call
const call = new Call(communicationBus9)
call.communicationBus = communicationBus10
const result = call.communicationBus

// Expect result
expect(result).toEqual(communicationBus10)
})

it('Call-peer', () => {
// Arguments
const communicationBus11 = undefined!
const peer1 = undefined!

// Property call
const call = new Call(communicationBus11)
call.peer = peer1
const result = call.peer

// Expect result
expect(result).toEqual(peer1)
})

it('Call-signalingBuffer', () => {
// Arguments
const communicationBus12 = undefined!
const signalingBuffer1 = undefined!

// Property call
const call = new Call(communicationBus12)
call.signalingBuffer = signalingBuffer1
const result = call.signalingBuffer

// Expect result
expect(result).toEqual(signalingBuffer1)
})

it('Call-stream', () => {
// Arguments
const communicationBus13 = undefined!
const stream8 = undefined!

// Property call
const call = new Call(communicationBus13)
call.stream = stream8
const result = call.stream

// Expect result
expect(result).toEqual(stream8)
})

})
