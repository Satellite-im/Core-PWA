import { expect } from '@jest/globals'
import mutations from '~/store/sounds/mutations'

describe('init', () => {
  const InitialSettingsState = {
    message: true,
    call: true,
    mute: true,
    deafen: true,
    undeafen: true,
    upload: true,
    connected: true,
  }
  let inst: any

  beforeEach(() => {
    inst = mutations
  })

  it('should set sound state', () => {
    inst.set(InitialSettingsState, { key: 'mute', value: false })

    expect(InitialSettingsState).toEqual({
      message: true,
      call: true,
      mute: false,
      deafen: true,
      undeafen: true,
      upload: true,
      connected: true,
    })
  })
})
