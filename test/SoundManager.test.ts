import SoundManager, { Sounds } from '../libraries/SoundManager/SoundManager'
import 'ts-jest'

 //since jest is headless, HTMLMediaElement does not exist. This makes it so the SoundManager class thinks HTMLMediaElement exists
window.HTMLMediaElement.prototype.load = jest.fn()
window.HTMLMediaElement.prototype.play = jest.fn()

describe('Test class SoundManager', () => {
  const soundManager = new SoundManager()
  it('PlaySound - Should throw an error when sound does not exist', () => {
    expect(() => {
       //@ts-ignore
      return soundManager.playSound('SoundThatDoesNotExist')
    }).toThrow('Sound not found')
  })
  it('PlaySound - Should not throw error when playing a sound that exists', () => {
    expect(() => {
      soundManager.playSound(Sounds.MUTE)
    }).not.toThrow()
  })
  it('StopSound - Should throw an error when sound does not exist', () => {
    expect(() => {
       //@ts-ignore
      soundManager.stopSound('SoundThatDoesNotExist')
    }).toThrow('Sound not found')
  })
  it('StopSound - Should not throw error when playing a sound that exists', () => {
    expect(() => {
      soundManager.stopSound(Sounds.MUTE)
    }).not.toThrow()
  })

/*
 TODO: I can't get this one to work at all
   it('changeLevels - Should not throw error when playing a sound that exists', () => {
     console.log(soundManager.sounds[Sounds.MUTE])
     soundManager.changeLevels(99/100)
     console.log(soundManager.sounds[Sounds.MUTE])
     expect(() => {
         soundManager.changeLevels(50/124)
     })
   })

     it('Should have expected enums', () => {
         console.log('Sounds', Sounds)
       expect(Sounds).toMatchInlineSnapshot(`
         Sounds {
           NEW_MESSAGE: 'newMessage',
           CALL: 'call',
           HANGUP: 'hangup',
           MUTE: 'mute',
           UNMUTE: 'unmute',
           DEAFEN: 'deafen',
           UNDEAFEN: 'undeafen',
           UPLOAD: 'upload',
           CONNECTED: 'connected',
         }
        )
      }) */
})