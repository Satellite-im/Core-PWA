import * as hub from '@textile/hub'
import * as index from '@textile/grpc-authentication/dist/cjs/index'
import * as NotificationManager from '~/libraries/Iridium/NotificationManager'

describe('NotificationManager.NotificationManager.isInitialized', () => {
  let inst4: any
  let inst3: any
  let inst2: any
  let inst5: any

  beforeEach(() => {
    inst4 = new hub.Client(undefined, true)
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst5 = new NotificationManager.NotificationManager({
      identity: {
        sign: () => inst2,
        public: { verify: () => true, bytes: inst3 },
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
        mnemonic: undefined,
        privateKey: '',
        path: undefined,
        address: '',
      },
    })
  })

  test('0', () => {
    const result: any = inst5.isInitialized()
    expect(result).toMatchSnapshot()
  })
})
