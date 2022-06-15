import * as BlockchainClient from '~/libraries/BlockchainClient/BlockchainClient'

describe.skip('BlockchainClient.default.getInstance', () => {
  // skipped due to the local env
  test('0', () => {
    const result: any = BlockchainClient.default.getInstance()
    expect(result).toMatchSnapshot()
  })
})
