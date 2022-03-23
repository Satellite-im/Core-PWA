import { ThreadID } from '@textile/hub'
import * as hub from '@textile/hub'
import * as web3 from '@solana/web3.js'
import Vue from 'vue'
import * as MetadataManager from './MetadataManager'
import TextileManager from '~/libraries/Textile/TextileManager'
Vue.prototype.$TextileManager = new TextileManager()

const client = new hub.Client(undefined, false)
const uint8array = new Uint8Array([])

describe('', () => {
  let MetadataManagerConstructor: any
  beforeEach(() => {
    MetadataManagerConstructor = new MetadataManager.MetadataManager({
      identity: {
        sign: () => uint8array,
        public: { verify: () => true, bytes: uint8array },
      },
      client,
      users: hub.Users.withUserAuth(
        { key: '', sig: '', msg: '', token: '' },
        undefined,
      ),
      wallet: {
        mnemonic: '',
        keypair: web3.Keypair.generate(),
        path: '',
        address: '',
      },
    })
  })
  test('MetadataManager.init', async () => {
    ThreadID.fromString = jest.fn().mockReturnValue('aidi')
    MetadataManagerConstructor.textile = jest.fn().mockReturnValue({})
    MetadataManagerConstructor.textile.users = jest.fn().mockReturnValue({})
    MetadataManagerConstructor.textile.users.getThread = jest
      .fn()
      .mockReturnValue('id')
    MetadataManagerConstructor.textile.client = jest.fn().mockReturnValue({})
    MetadataManagerConstructor.textile.client.newCollection = jest
      .fn()
      .mockReturnValue({ a: 'b' })
    await MetadataManagerConstructor.init()
    expect(
      MetadataManagerConstructor.textile.client.newCollection,
    ).toHaveBeenCalled()
  })
})
