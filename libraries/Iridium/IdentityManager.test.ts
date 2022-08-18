import IdentityManager from './IdentityManager'

describe('Test generateEntropyMessage', () => {
  it('should return an uin8array', () => {
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
})

describe('Test seedRandom', () => {
  it('should exist', async () => {
    const result = await IdentityManager.seedRandom()
    expect(result).not.toBeFalsy() // The result exists
  })
})
