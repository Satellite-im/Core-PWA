import { web3 } from '@project-serum/anchor'
import * as Solana from '~/libraries/Solana/Solana'

describe('Solana.getClusterFromNetworkConfig', () => {
  test('0', () => {
    const result: any = Solana.getClusterFromNetworkConfig('mainnet-beta')
    expect(result).toMatchSnapshot()
  })
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

describe('Solana.sleep', () => {
  test('0', () => {
    const result: any = Solana.sleep(0)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Solana.sleep(-5.48)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Solana.sleep(-100)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Solana.sleep(-Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('Solana.publicKeyFromSeeds', () => {
  test('0', async () => {
    const inst: any = new Uint8Array([0, -100])
    const inst2: any = new Uint8Array([-100, -100])
    const inst3: any = new Uint8Array([-1, -1])
    const inst4: any = new Uint8Array([0, 100])
    const param1: any = [inst, inst2, inst3, inst4]
    const param3: any = new web3.PublicKey(1)
    await Solana.publicKeyFromSeeds(param1, 'This is a Text', param3)
  })

  describe('Solana.publicKeyFromSeeds', () => {
    test('0', async () => {
      const inst: any = new Uint8Array([0, -100])
      const inst2: any = new Uint8Array([-100, -100])
      const inst3: any = new Uint8Array([-1, -1])
      const inst4: any = new Uint8Array([0, 100])
      const param1: any = [inst, inst2, inst3, inst4]
      const param3: any = new web3.PublicKey(1)
      await Solana.publicKeyFromSeeds(param1, 'This is a Text', param3)
    })
  })

  describe('Solana.publicKeyFromSeeds', () => {
    test('0', async () => {
      const inst: any = new Uint8Array([0, -100])
      const inst2: any = new Uint8Array([-100, -100])
      const inst3: any = new Uint8Array([-1, -1])
      const inst4: any = new Uint8Array([0, 100])
      const param1: any = [inst, inst2, inst3, inst4]
      const param3: any = new web3.PublicKey(1)
      await Solana.publicKeyFromSeeds(param1, 'This is a Text', param3)
    })
  })
})
