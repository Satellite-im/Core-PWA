import * as web3 from '@solana/web3.js'
import { expect } from '@jest/globals'
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

describe.skip('Solana.publicKeyFromSeeds', () => {
  // AP-330
  test('0', async () => {
    const inst: any = new Uint8Array([-1, -1, 1, 100, 100])
    const inst2: any = new Uint8Array([100, 1, 100, 0, 0])
    const param1: any = [inst, inst2]
    const param3: any = new web3.PublicKey(10)
    await Solana.publicKeyFromSeeds(param1, 'Foo bar', param3)
  })

  test('1', async () => {
    const inst: any = new Uint8Array([100, -100, 0, 0, -1])
    const inst2: any = new Uint8Array([-100, -100, 0, -100, 100])
    const param1: any = [inst, inst2]
    const param3: any = new web3.PublicKey('Gail Hoppe')
    await Solana.publicKeyFromSeeds(param1, 'Hello, world!', param3)
  })

  test('2', async () => {
    const inst: any = new Uint8Array([-1, 100, -1, 1, 0])
    const inst2: any = new Uint8Array([1, 1, 100, 0, 1])
    const param1: any = [inst, inst2]
    const param3: any = new web3.PublicKey(1000)
    await Solana.publicKeyFromSeeds(param1, 'This is a Text', param3)
  })

  test('3', async () => {
    const inst: any = new Uint8Array([-100, -1, -100, 0, 100])
    const inst2: any = new Uint8Array([-1, 100, 1, 1, 0])
    const param1: any = [inst, inst2]
    const param3: any = new web3.PublicKey('Janet Homenick')
    await Solana.publicKeyFromSeeds(param1, 'foo bar', param3)
  })
})
