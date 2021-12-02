import SoundManager from '../libraries/SoundManager/SoundManager'

describe('Test class SoundManager', () => {

it('SoundManager-playSound', () => {
// Arguments
const volume1 = 10
const sound1 = undefined!

// Method call
const soundManager = new SoundManager(volume1)
 soundManager.playSound(sound1)
})

it('SoundManager-stopSound', () => {
// Arguments
const volume2 = 10
const sound2 = undefined!

// Method call
const soundManager = new SoundManager(volume2)
 soundManager.stopSound(sound2)
})

it('SoundManager-isPlaying', () => {
// Arguments
const volume3 = 10
const sound3 = undefined!

// Method call
const soundManager = new SoundManager(volume3)
const result =  soundManager.isPlaying(sound3)

// Expect result
expect(result).not.toBe('undefined')
})

it('SoundManager-changeLevels', () => {
// Arguments
const volume4 = 10
const volume5 = 10

// Method call
const soundManager = new SoundManager(volume4)
 soundManager.changeLevels(volume5)
})

it('SoundManager-sounds', () => {
// Arguments
const volume6 = 10
const sounds1 = undefined!

// Property call
const soundManager = new SoundManager(volume6)
soundManager.sounds = sounds1
const result = soundManager.sounds

// Expect result
expect(result).toBe(sounds1)
})

})
