import * as hub from '@textile/hub'
import * as UserManager from '~/libraries/Iridium/UserManager'

describe('UserManager.UserInfoManager.createCollection', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(() => {
    inst4 = new hub.Client(undefined, undefined)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new UserManager.UserInfoManager({
      identity: {
        sign: () => inst2,
        public: { verify: () => true, bytes: inst3 },
      },
      client: inst4,
      users: hub.Users.withUserAuth(
        { key: '', sig: '', msg: '', token: '' },
        undefined,
      ),
      wallet: { mnemonic: undefined, privateKey: '', path: '', address: '' },
    })
  })

  test('0', async () => {
    await inst5.createCollection()
  })
})

describe('UserManager.UserInfoManager.createCollection', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(() => {
    inst4 = new hub.Client(undefined, false)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new UserManager.UserInfoManager({
      identity: {
        sign: () => inst2,
        public: { verify: () => true, bytes: inst3 },
      },
      client: inst4,
      users: hub.Users.withUserAuth(
        () => ({ key: '', sig: '', msg: '', token: undefined }),
        undefined,
      ),
      wallet: {
        mnemonic: undefined,
        privateKey: '',
        path: undefined,
        address: '',
      },
    })
  })

  test('0', async () => {
    await inst5.createCollection()
  })
})
