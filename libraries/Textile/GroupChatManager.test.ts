import * as hub from '@textile/hub'
import * as web3 from '@solana/web3.js'
import * as GroupChatManager from '~/libraries/Textile/GroupChatManager'

describe('GroupChatManager.GroupChatManager.listenToGroupMessages', () => {
  let inst19: any
  let inst18: any
  let inst17: any
  let inst20: any
  let inst15: any
  let inst14: any
  let inst13: any
  let inst16: any
  let inst11: any
  let inst10: any
  let inst9: any
  let inst12: any
  let inst7: any
  let inst6: any
  let inst: any
  let inst8: any
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  const getThreadIDMock = jest
    .spyOn(GroupChatManager.GroupChatManager.prototype, 'getThreadID')
    .mockImplementation(async () => {
      return hub.ThreadID.fromString(
        'bafk6ejcqsusgao54pwp5u2ujhsdqgmipnlan2u67mhyivl46e6d53ly',
      )
    })

  const decodeGroupIDMock = jest
    .spyOn(GroupChatManager.GroupChatManager.prototype, 'decodeGroupID')
    .mockImplementation(() => {
      return {
        threadID: hub.ThreadID.fromString(
          'bafk6ejcqsusgao54pwp5u2ujhsdqgmipnlan2u67mhyivl46e6d53ly',
        ),
        collectionName: '58f64b84-541e-4e0a-a346-fca8d364fdbb',
      }
    })

  beforeEach(async () => {
    inst19 = new hub.Client(undefined, false)
    inst18 = new Uint8Array([])
    inst17 = new Uint8Array([])
    inst20 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst17,
          public: { verify: () => true, bytes: inst18 },
        },
        client: inst19,
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
      },
      '',
    )
    await inst20.init()
    inst15 = new hub.Client(undefined, false)
    inst14 = new Uint8Array([])
    inst13 = new Uint8Array([])
    inst16 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst13,
          public: { verify: () => false, bytes: inst14 },
        },
        client: inst15,
        users: hub.Users.withUserAuth(
          {
            key: 'Dillenberg',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: '',
            token: 'not in',
          },
          undefined,
        ),
        wallet: {
          mnemonic: '!Lov3MyPianoPony',
          keypair: web3.Keypair.generate(),
          path: '.',
          address: '0.0.0.0',
        },
      },
      'Becky Bednar',
    )
    await inst16.init()
    inst11 = new hub.Client(undefined, false)
    inst10 = new Uint8Array([])
    inst9 = new Uint8Array([])
    inst12 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst9,
          public: { verify: () => true, bytes: inst10 },
        },
        client: inst11,
        users: hub.Users.withUserAuth(
          {
            key: 'Dillenberg',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'missing encoding',
            token: '+=',
          },
          undefined,
        ),
        wallet: {
          mnemonic: '$p3onyycat',
          keypair: web3.Keypair.generate(),
          path: 'C:\\\\path\\to\\file.ext',
          address: '0.0.0.0',
        },
      },
      'Becky Bednar',
    )
    await inst12.init()
    inst7 = new hub.Client(undefined, false)
    inst6 = new Uint8Array([])
    inst = new Uint8Array([])
    inst8 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst,
          public: { verify: () => false, bytes: inst6 },
        },
        client: inst7,
        users: hub.Users.withUserAuth(
          {
            key: 'elio@example.com',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: "Top level object in 'override.yml' needs to be an object",
            token: ' ',
          },
          undefined,
        ),
        wallet: {
          mnemonic: 'YouarenotAllowed2Use',
          keypair: web3.Keypair.generate(),
          path: './path/to/file',
          address: '192.168.1.5',
        },
      },
      'Becky Bednar',
    )
    await inst8.init()
    inst4 = new hub.Client(undefined, false)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => false, bytes: inst3 },
        },
        client: inst4,
        users: hub.Users.withUserAuth(
          {
            key: 'Elio',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'Unknown error',
            token: '`',
          },
          undefined,
        ),
        wallet: {
          mnemonic: 'accessdenied4u',
          keypair: web3.Keypair.generate(),
          path: 'C:\\\\path\\to\\file.ext',
          address: '0.0.0.0',
        },
      },
      'Becky Bednar',
    )
    await inst5.init()
  })

  test('0', async () => {
    await inst5.listenToGroupMessages(() => undefined, { id: 'da7588892' })
  })

  test('1', async () => {
    await inst8.listenToGroupMessages(() => undefined, { id: '12345' })
  })

  test('2', async () => {
    await inst12.listenToGroupMessages(() => undefined, {
      id: 'c466a48309794261b64a4f02cfcc3d64',
    })
  })

  test('3', async () => {
    await inst16.listenToGroupMessages(() => undefined, {
      id: 'bc23a9d531064583ace8f67dad60f6bb',
    })
  })

  test('4', async () => {
    await inst20.listenToGroupMessages(() => undefined, { id: '' })
  })
})

describe('GroupChatManager.GroupChatManager.isInitialized', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(async () => {
    inst4 = new hub.Client(undefined, undefined)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new GroupChatManager.GroupChatManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => false, bytes: inst3 },
        },
        client: inst4,
        users: hub.Users.withUserAuth(
          { key: '', sig: '', msg: '', token: undefined },
          undefined,
        ),
        wallet: {
          mnemonic: undefined,
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '',
        },
      },
      '',
    )
    await inst5.init()
  })

  test('0', () => {
    const result: any = inst5.isInitialized()
    expect(result).toMatchSnapshot()
  })
})
