import { expect } from '@jest/globals'
import * as getters from '~/store/prerequisites/getters'

describe('getters.default.allPrerequisitesReady', () => {
  test('0', () => {
    const result: any = getters.default.allPrerequisitesReady({
      accountsReady: true,
      textileReady: false,
      p2pReady: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = getters.default.allPrerequisitesReady({
      accountsReady: true,
      textileReady: true,
      p2pReady: false,
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = getters.default.allPrerequisitesReady({
      accountsReady: true,
      textileReady: true,
      p2pReady: true,
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = getters.default.allPrerequisitesReady({
      accountsReady: true,
      textileReady: false,
      p2pReady: true,
    })
    expect(result).toMatchSnapshot()
  })
})
