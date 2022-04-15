import { encrypt, PublicKey, ThreadID } from '@textile/hub'
import { web3 } from '@project-serum/anchor'
import { MetadataManager } from './MetadataManager'

jest.mock('@textile/hub')
PublicKey.fromString.mockImplementation(() => {
  function encrypt(param) {
    return Buffer.from('Hello, World', 'utf8')
  }
  return encrypt
})

describe('', () => {
  const konstruktor = new MetadataManager(
    {
      identity: {
        sign: () => new Uint8Array([]),
        public: { verify: () => false, bytes: new Uint8Array([]) },
        // public: '0xpublickey',
      },
      client: {
        newCollection: () =>
          jest.fn().mockImplementationOnce(() => Promise.resolve()),
      },
      users: {
        getThread: () =>
          jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
              id: 'id',
              name: 'name',
            }),
          ),
      },
      wallet: {
        mnemonic: '!Lov3MyPianoPony',
        keypair: web3.Keypair.generate(),
        path: '.',
        address: '0.0.0.0',
      },
    },
    'Becky Bednar',
  )
  test('updateMetadata with no threadID', async () => {
    try {
      const result = await konstruktor.updateMetadata({
        to: `0xrecipientkey`,
        from: `0xsenderkey`,
        metadata: { note: 'note' },
      })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Metadata manager is not initialized.',
      )
    }
  })
  test('', async () => {
    ThreadID.fromString.mockImplementationOnce(() => new Uint8Array([]))
    const result = await konstruktor.init()
    expect(result).toBeUndefined() // Dummy assertion, we'll replace it with what the result returns
  })
  test('updateMetadata with threadID', async () => {
    ThreadID.fromString.mockImplementationOnce(() => new Uint8Array([]))
    const result = await konstruktor.updateMetadata({
      to: `0xrecipientkey`,
      from: `0xsenderkey`,
      metadata: { note: 'note' },
    })
    expect(result).toBe({}) // Dummy assertion, we'll replace it with what the result returns
  })
  test('getMetadata', async () => {
    ThreadID.fromString.mockImplementationOnce(() => new Uint8Array([]))
    const result = await konstruktor.getMetadata({
      to: `0xrecipientkey`,
      from: `0xsenderkey`,
    })
    expect(result).toBe({}) // Dummy assertion, we'll replace it with what the result returns
  })
})
