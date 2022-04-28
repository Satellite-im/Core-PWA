import * as hub from '@textile/hub'
import * as index from '@textile/grpc-authentication/dist/cjs/index'
import * as web3 from '@solana/web3.js'
import * as BucketManager from '~/libraries/Textile/BucketManager'
const BucketManagerDefault = BucketManager.default

describe('BucketManager.default.progressParse', () => {
  let inst48: any
  let inst47: any
  let inst46: any
  let inst49: any
  let inst43: any
  let inst42: any
  let inst41: any
  let inst44: any
  let inst45: any
  let inst23: any
  let inst22: any
  let inst21: any
  let inst24: any
  let inst25: any
  let inst18: any
  let inst17: any
  let inst16: any
  let inst19: any
  let inst20: any
  let inst13: any
  let inst12: any
  let inst11: any
  let inst14: any
  let inst15: any
  let inst8: any
  let inst7: any
  let inst: any
  let inst9: any
  let inst10: any
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any
  let inst6: any
  let DefaultBucketManager: any

  beforeEach(() => {
    inst48 = new hub.Client(undefined, true)
    inst47 = new Uint8Array([])
    inst46 = new Uint8Array([])
    inst49 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst43 = new hub.Client(undefined, true)
    inst42 = new Uint8Array([])
    inst41 = new Uint8Array([])
    inst44 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst45 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst41,
          public: { verify: () => true, bytes: inst42 },
        },
        client: inst43,
        users: hub.Users.withUserAuth(
          { key: '', sig: '', msg: '', token: undefined },
          undefined,
        ),
        wallet: {
          mnemonic: '',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '',
        },
      },
      { sign: () => inst44, public: null },
      '',
    )
    DefaultBucketManager = BucketManager.default
    DefaultBucketManager = BucketManager.default
    DefaultBucketManager = BucketManager.default
    inst23 = new hub.Client(undefined, true)
    inst22 = new Uint8Array([])
    inst21 = new Uint8Array([])
    inst24 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst25 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst21,
          public: { verify: () => false, bytes: inst22 },
        },
        client: inst23,
        users: hub.Users.withUserAuth(
          {
            key: 'elio@example.com',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'Error in retrieving email.',
            token: undefined,
          },
          undefined,
        ),
        wallet: {
          mnemonic: 'NoWiFi4you',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '192.168.1.5',
        },
      },
      { sign: () => inst24, public: null },
      'Janet Homenick',
    )
    inst18 = new hub.Client(undefined, true)
    inst17 = new Uint8Array([])
    inst16 = new Uint8Array([])
    inst19 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst20 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst16,
          public: { verify: () => true, bytes: inst17 },
        },
        client: inst18,
        users: hub.Users.withUserAuth(
          {
            key: 'Dillenberg',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'Error getting key from: %s',
            token: undefined,
          },
          undefined,
        ),
        wallet: {
          mnemonic: 'YouarenotAllowed2Use',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '192.168.1.5',
        },
      },
      { sign: () => inst19, public: null },
      'Becky Bednar',
    )
    inst13 = new hub.Client(undefined, true)
    inst12 = new Uint8Array([])
    inst11 = new Uint8Array([])
    inst14 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst15 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst11,
          public: { verify: () => false, bytes: inst12 },
        },
        client: inst13,
        users: hub.Users.withUserAuth(
          {
            key: 'Dillenberg',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'does not exist',
            token: undefined,
          },
          undefined,
        ),
        wallet: {
          mnemonic: '!Lov3MyPianoPony',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '192.168.1.5',
        },
      },
      { sign: () => inst14, public: null },
      'Ronald Keeling',
    )
    inst8 = new hub.Client(undefined, true)
    inst7 = new Uint8Array([])
    inst = new Uint8Array([])
    inst9 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst10 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst,
          public: { verify: () => true, bytes: inst7 },
        },
        client: inst8,
        users: hub.Users.withUserAuth(
          {
            key: 'Elio',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'Could not find an existing submission in location.  rubric is original.',
            token: undefined,
          },
          undefined,
        ),
        wallet: {
          mnemonic: 'accessdenied4u',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '0.0.0.0',
        },
      },
      { sign: () => inst9, public: null },
      'Janet Homenick',
    )
    inst4 = new hub.Client(undefined, true)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new Uint8Array([])
    DefaultBucketManager = BucketManager.default
    inst6 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => true, bytes: inst3 },
        },
        client: inst4,
        users: hub.Users.withUserAuth(
          {
            key: 'Dillenberg',
            sig: '3d4e60b996ff9c5d5788e333a0cba6f238a22c6c0f94788870e1a9ecd482e152',
            msg: 'invalid option',
            token: undefined,
          },
          undefined,
        ),
        wallet: {
          mnemonic: '!Lov3MyPianoPony',
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '192.168.1.5',
        },
      },
      { sign: () => inst5, public: null },
      'Becky Bednar',
    )
  })

  test('0', () => {
    const result: any = inst6.progressParse(10, 0)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst10.progressParse(2, 300)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst15.progressParse(16, 10000)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst20.progressParse(1, 0.0)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst25.progressParse(256, 0.0)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst45.progressParse(NaN, NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('BucketManager.default.getBucket', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(() => {
    inst4 = new hub.Client(undefined, undefined)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    const DefaultBucketManager = BucketManager.default
    inst5 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => true, bytes: inst3 },
        },
        client: inst4,
        users: hub.Users.withUserAuth(
          () => ({ key: '', sig: '', msg: '', token: '' }),
          undefined,
        ),
        wallet: {
          mnemonic: undefined,
          keypair: web3.Keypair.generate(),
          path: undefined,
          address: '',
        },
      },
      null,
      '',
    )
  })

  test('0', async () => {
    await inst5.getBucket()
  })
})

describe('BucketManager.default.getLinks', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(() => {
    inst4 = new hub.Client(undefined, false)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    const DefaultBucketManager = BucketManager.default
    inst5 = new DefaultBucketManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => false, bytes: inst3 },
        },
        client: inst4,
        users: hub.Users.copyAuth(
          index.GrpcAuthentication.withUserAuth(
            { key: '', sig: '', msg: '', token: '' },
            undefined,
          ),
          undefined,
        ),
        wallet: {
          mnemonic: '',
          keypair: web3.Keypair.generate(),
          path: '',
          address: '',
        },
      },
      null,
      '',
    )
  })

  test('0', async () => {
    await inst5.getLinks()
  })

  describe('BucketManager.default.fetchIndex', () => {
    let inst4: any
    let inst3: any
    let inst2: any
    let inst5: any

    beforeEach(() => {
      inst4 = new hub.Client(undefined, true)
      inst3 = new Uint8Array([])
      inst2 = new Uint8Array([])
      inst5 = new BucketManagerDefault(
        {
          identity: {
            sign: () => inst2,
            public: { verify: () => false, bytes: inst3 },
          },
          client: inst4,
          users: hub.Users.copyAuth(
            index.GrpcAuthentication.withUserAuth(
              () => ({ key: '', sig: '', msg: '', token: '' }),
              undefined,
            ),
            undefined,
          ),
          wallet: {
            mnemonic: undefined,
            keypair: web3.Keypair.generate(),
            path: undefined,
            address: '',
          },
        },
        undefined,
        '',
      )
    })

    test('0', async () => {
      await inst5.fetchIndex()
    })
  })
})
