import GroupCrypto from './GroupCrypto'

jest.mock('@solana/web3.js')
jest.mock('~/libraries/Crypto/Crypto')
jest.mock('~/libraries/Solana/GroupChatsProgram/GroupChatsProgram.types')

describe('GroupCrypto', () => {
  let instance: GroupCrypto

  beforeEach(() => {
    instance = new GroupCrypto()
  })

  it('instance should be an instanceof GroupCrypto', () => {
    expect(instance instanceof GroupCrypto).toBeTruthy()
  })
})
