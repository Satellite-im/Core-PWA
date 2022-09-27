import BlockchainClient from './BlockchainClient'

describe('Test BlockchainClient', () => {
  test('get account but it is uninitialized', () => {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    try {
      const result = $BlockchainClient.account
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', `Account is not initialized`)
    }
  })

  test('get payerAccount but it is uninitialized', () => {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    try {
      const result = $BlockchainClient.payerAccount
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', `PayerAccount is not initialized`)
    }
  })

  test('get isInitialized', () => {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const result = $BlockchainClient.isInitialized
    expect(result).toBeFalsy()
  })

  test('get isPayerInitialized', () => {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    const result = $BlockchainClient.isPayerInitialized
    expect(result).toBeFalsy()
  })

  test.skip('setPhotoHash', () => {
    const mockedFunction = jest.fn()
    const constructorArguments = {
      setPhotoHash: mockedFunction,
    }
    const $BlockchainClient: BlockchainClient =
      BlockchainClient.getInstance(constructorArguments)
    const result = $BlockchainClient.setPhotoHash('string')
    expect(result).toBeFalsy()
    expect(mockedFunction).toHaveBeenCalled()
  })
})
