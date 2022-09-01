import * as module from './types'

describe('Test Iridium/settings/types', () => {
  it('should return themes', () => {
    expect(module.themes).toMatchSnapshot()
  })

  it('should return flairs', () => {
    expect(module.flairs).toMatchSnapshot()
  })

  it('should return languages', () => {
    expect(module.languages).toMatchSnapshot()
  })

  it('should return default sounds', () => {
    expect(module.defaultSounds).toMatchSnapshot()
  })

  it('should return default keybinds', () => {
    expect(module.defaultKeybinds).toMatchSnapshot()
  })
})
