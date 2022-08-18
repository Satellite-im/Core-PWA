import IdentityManager from './IdentityManager'
const crypto = require('crypto')

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
})

describe('', () => {
  test('generateEntropyMessage', () => {
    const localParam = {
      address: 'address',
      secret: 'secret',
    }
    const result = IdentityManager.generateEntropyMessage(
      localParam.address,
      localParam.secret,
    )
    expect(result).toMatchSnapshot()
  })
  test('seedRandom', async () => {
    const result = await IdentityManager.seedRandom()
    expect(result).not.toBeFalsy() // The result exists
  })
})
