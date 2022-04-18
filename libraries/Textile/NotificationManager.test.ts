import * as hub from '@textile/hub'
import * as web3 from '@solana/web3.js'
import * as NotificationManager from '~/libraries/Textile/NotificationManager'

describe('NotificationManager.NotificationManager.isInitialized', () => {
  let inst3: any
  let inst2: any
  let inst4: any

  beforeEach(() => {
    inst3 = new Uint8Array([])
    inst2 = new Uint8Array([])
    inst4 = new NotificationManager.NotificationManager(
      {
        identity: {
          sign: () => inst2,
          public: { verify: () => true, bytes: inst3 },
        },
        client: hub.Client.withUserAuth(
          () => ({ key: '', sig: '', msg: '', token: '' }),
          '',
          false,
        ),
        users: hub.Users.withUserAuth(undefined, undefined),
        wallet: {
          mnemonic: '',
          keypair: web3.Keypair.generate(),
          path: '',
          address: '',
        },
      },
      null,
    )
  })

  test('0', () => {
    const result: any = inst4.isInitialized()
    expect(result).toMatchSnapshot()
  })
})
