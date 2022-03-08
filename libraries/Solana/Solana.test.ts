import * as web3 from '@solana/web3.js'
import * as Solana from '~/libraries/Solana/Solana'

describe('Solana.getClusterFromNetworkConfig', () => {
  test('0', () => {
    const result: any = Solana.getClusterFromNetworkConfig('mainnet-beta')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Solana.getClusterFromNetworkConfig('testnet')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Solana.getClusterFromNetworkConfig('West')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Solana.getClusterFromNetworkConfig('North')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = Solana.getClusterFromNetworkConfig('')
    expect(result).toMatchSnapshot()
  })
})
