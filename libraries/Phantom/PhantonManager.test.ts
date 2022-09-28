import { web3 } from '@project-serum/anchor'
import PhantomManager from '~/libraries/Phantom/PhantomManager'
import { AccountsError } from '~/store/accounts/types'

describe('Test PhantomManager after Solana mock', () => {
  it('should throws on mnemonic not present', async () => {
    try {
      const result = new PhantomManager()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        AccountsError.MNEMONIC_NOT_PRESENT,
      )
    }
  })
})

describe('Test PhantomManager after Solana mock', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'solana', {
      configurable: true,
      value: true,
    })
  })

  afterAll(() => {
    Object.defineProperty(window, 'solana', {
      configurable: true,
      value: {},
    })
  })

  it('should fail to initialize wallet', async () => {
    // Reason for failing: value should have (isPhantom: true) rather than just true in window.solana
    try {
      const result = new PhantomManager()
      result.initWallet()
      expect(result).toBe(123)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        AccountsError.MNEMONIC_NOT_PRESENT,
      )
    }
  })

  it('should fail to initialize wallet', async () => {
    // Reason for failing: related to non-existence of isPhantom on window.solana
    try {
      const constructor = new PhantomManager()
      const keypair = web3.Keypair.generate()
      const result = constructor.getAccountBalance(keypair.publicKey)
      expect(result).toBe(123)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        AccountsError.MNEMONIC_NOT_PRESENT,
      )
    }
  })
})
