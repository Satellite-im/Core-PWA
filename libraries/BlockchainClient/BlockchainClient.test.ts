import * as BlockchainClient from '~/libraries/BlockchainClient/BlockchainClient'

describe('BlockchainClient.default.getInstance', () => {
  test('0', () => {
    const result: any = BlockchainClient.default.getInstance()
    expect(result).toMatchSnapshot()
  })
})