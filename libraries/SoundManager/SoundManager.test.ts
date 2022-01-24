import { Howl } from 'howler'

import { Sounds } from './SoundManager'
import SoundManager from './SoundManager'

describe('init', () => {
    it('should pass',() => {
        expect(Sounds).toMatchSnapshot(`
    Object {
    "CALL": "call",
    "CONNECTED": "connected",
    "DEAFEN": "deafen",
    "HANGUP": "hangup",
    "MUTE": "mute",
    "NEW_MESSAGE": "newMessage",
    "UNDEAFEN": "undeafen",
    "UNMUTE": "unmute",
    "UPLOAD": "upload",
    }
        `)
    })
})

describe('Manage sounds', () => {
    let inst: any
    let volume: number = 1.0

    beforeEach(() => {
        inst = new SoundManager(volume)
    })

    test('sound exists', () => {
        let result: any = inst.existsSound(Sounds.CALL)
        expect(result).toMatchSnapshot()
    })
    
    test('sound doesn\'t exists', () => {
        try {
            inst.existsSound(null)
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Sound not found');
        }
    })
    
    test('sound plays', () => {
        const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'play')
        let result: any = inst.playSound(Sounds.CALL)

        // Some sort of lead for the `Error: Not implemented: HTMLMediaElement.prototype.play` error, also `prototype.pause`
        //
        // const playStub = jest
        //         .spyOn(window.HTMLMediaElement.prototype, 'play')
        //         .mockImplementation(() => new Promise<void>((resolve, reject) => {
        //             return {}
        //         }))
        // const loadStub = jest
        //         .spyOn(window.HTMLMediaElement.prototype, 'load')
        //         .mockImplementation(() => {})
        // expect(playStub).not.toHaveBeenCalled();
        // expect(loadStub).not.toHaveBeenCalled();

        expect(spy).toHaveBeenCalled();
        expect(result).toMatchSnapshot()
    })
    
    test('sound stops', () => {
        const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'stop')
        let result: any = inst.stopSound(Sounds.CALL)

        expect(spy).toHaveBeenCalled();
        expect(result).toMatchSnapshot()
    })
    
    test('sound is playing', () => {
        const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'playing')
        let result: any = inst.isPlaying(Sounds.CALL)

        expect(spy).toHaveBeenCalled();
        expect(result).toMatchSnapshot()
    })
    
    test('change volume level of sound', () => {
        const spy = jest.spyOn(inst.sounds[Sounds.CALL], 'volume')
        let result: any = inst.changeLevels(volume)

        expect(spy).toHaveBeenCalled();
        expect(result).toMatchSnapshot()
    })
})