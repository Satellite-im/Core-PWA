import { macShortcuts, windowsShortcuts } from '~/utilities/HotkeyList'

describe('check windowsShortcuts constants', () => {
  const inst: any = windowsShortcuts

  it('should return the windowsShortcuts constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the windowsShortcuts constants', () => {
    expect(inst).not.toEqual({})
  })
})

describe('check macShortcuts constants', () => {
  const inst: any = macShortcuts

  it('should return the macShortcuts constants', () => {
    expect(inst).toMatchSnapshot()
  })

  it('should not return the macShortcuts constants', () => {
    expect(inst).not.toEqual({})
  })
})
