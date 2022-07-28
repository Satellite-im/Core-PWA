import InitialSettingsState from '~/store/settings/state'
import getters from '~/store/settings/getters'

const state = {
  ...InitialSettingsState(),
  timezone: 'Europe/Paris',
}

describe('settings.getters', () => {
  test('getTimestamp', () => {
    const actual = getters.getTimestamp(state)({ time: 1654486643615 })
    expect(actual).toMatchSnapshot()
  })

  test('getFullTimestamp', () => {
    const actual = getters.getTimestamp(state)({
      time: 1654486643615,
      full: true,
    })
    expect(actual).toMatchSnapshot()
  })
})
