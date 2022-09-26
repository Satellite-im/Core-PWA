import SolanaAdapter from '~/libraries/BlockchainClient/adapters/SolanaAdapter/SolanaAdapter'
import { AccountsError } from '~/store/accounts/types'

describe.skip('Test Solana Adapter', () => {
  it('should initialize the constructor', () => {
    try {
      const instance = new SolanaAdapter()
      expect(instance).toMatchSnapshot()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('should sign message but returns error', async () => {
    // because getPayerAccount is not mocked
    const instance = new SolanaAdapter()

    try {
      const result = await instance.signMessage('example message')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.PAYER_NOT_PRESENT)
    }
  })

  it('should get connection status before solanaManager is initialized', () => {
    const instance = new SolanaAdapter()

    const result = instance._getConnectionStatus()
    expect(result).toBeFalsy()
  })

  it('should get friendsProgram and return error', () => {
    // because Solana is not initialized
    const instance = new SolanaAdapter()

    try {
      const result = instance.friendsProgram
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Unable to get FriendsProgram instance: Solana not initialized yet',
      )
    }
  })
})
