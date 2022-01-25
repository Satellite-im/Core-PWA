import InitialSettingsState from '~/store/sounds/state'

describe('init', () => {
    let inst: any

    beforeEach(() => {
        inst = InitialSettingsState()
    })

    it('should return the initial settings state', () => {
        expect(inst).toEqual({
            message: true,
            call: true,
            mute: true,
            deafen: true,
            undeafen: true,
            upload: true,
            connected: true,
        })
    })

    it('should not return the initial settings state', () => {
        expect(inst).not.toEqual({})
    })
})