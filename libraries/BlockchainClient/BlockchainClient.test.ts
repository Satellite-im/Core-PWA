import BlockchainClient from './BlockchainClient'

describe('', () => {
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

  test.skip('get account but it has been initialized', async () => {
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()
    $BlockchainClient.initRandom()
    // try {
    const result = $BlockchainClient.account
    expect(result).toBe(true)
    // } catch (error) {
    //   expect(error).toBeInstanceOf(Error)
    //   expect(error).toHaveProperty('message', `Account is not initialized`)
    // }
  })
})
