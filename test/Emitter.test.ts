import Emitter from "../libraries/WebRTC/Emitter"

describe('Test class Emitter', () => {

it('Emitter-on', () => {
// Arguments
const event1 = undefined!
const listener1 = undefined!

// Method call
const emitter = new Emitter()
 emitter.on(event1, listener1)
})

it('Emitter-off', () => {
// Arguments
const event2 = undefined!
const listenerToRemove1 = undefined!

// Method call
const emitter = new Emitter()
 emitter.off(event2, listenerToRemove1)
})

})
