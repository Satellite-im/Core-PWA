import getters from '~/store/settings/getters'
import InitialSettingsState from '~/store/settings/state'

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

  test('getDate', () => {
    const actual = getters.getDate(state)(1654486643615)
    expect(actual).toEqual('06/06/2022')
  })
})
