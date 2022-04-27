import { web3 } from '@project-serum/anchor'
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

    test('1', async () => {
      const param1: any = new web3.PublicKey(
        Buffer.from('Hello, World', 'utf8'),
      )
      const param3: any = new web3.PublicKey(
        Buffer.from('Hello, Venus', 'utf8'),
      )
      await Solana.publicKeyFromSeed(param1, '', param3)
    })
  })
})

describe('Solana.waitForAccount', () => {
  test('0', async () => {
    const param1: any = new web3.Connection('http://localhost:8899')
    const param2: any = new web3.PublicKey(10)
    try {
      await Solana.waitForAccount(param1, param2)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
  test('1', async () => {
    web3.Connection.getAccountInfo = jest.fn().mockResolvedValueOnce(null)
    const param1: any = new web3.Connection('http://localhost:8899')
    const param2: any = new web3.PublicKey(10)
    try {
      await Solana.waitForAccount(param1, param2)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
  test('2', async () => {
    web3.Connection.getAccountInfo = jest.fn().mockResolvedValueOnce(true)
    const param1: any = new web3.Connection('http://localhost:8899')
    const param2: any = new web3.PublicKey(10)
    try {
      await Solana.waitForAccount(param1, param2)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})

describe('Solana.stringToBuffer', () => {
  test('0', () => {
    const param1 = 'Hello, World'
    const result: any = Solana.stringToBuffer(param1, param1.length)
    expect(result).toMatchSnapshot()
  })
})

describe('Solana.stringFromBuffer', () => {
  test('0', () => {
    const param1 = Buffer.from('Hello, World', 'utf8')
    const result: any = Solana.stringFromBuffer(param1)
    expect(result).toMatchSnapshot()
  })
})
