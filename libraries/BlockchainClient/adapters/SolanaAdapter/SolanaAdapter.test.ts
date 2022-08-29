import SolanaAdapter from '~/libraries/BlockchainClient/adapters/SolanaAdapter/SolanaAdapter'
import { AccountsError } from '~/store/accounts/types'

describe('Test Solana Adapter', () => {
  it('should initialize the constructor', () => {
    const konstruktor = new SolanaAdapter()
    expect(() => konstruktor).not.toThrow(Error)
  })
  it('should sign message but returns error', async () => {
    // because getPayerAccount is not mocked
    const konstruktor = new SolanaAdapter()

    try {
      const result = await konstruktor.signMessage('example message')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', AccountsError.PAYER_NOT_PRESENT)
    }
  })
  it('should get connection status before solanaManager is is initialized', () => {
    const konstruktor = new SolanaAdapter()

    const result = konstruktor._getConnectionStatus()
    expect(result).toBeFalsy()
  })
  it('should get(ter) friendsProgram and return error', () => {
    // because Solana is not initialized
    const konstruktor = new SolanaAdapter()

    try {
      const result = konstruktor.friendsProgram
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Unable to get FriendsProgram instance: Solana not initialized yet',
      )
    }
  })
})
