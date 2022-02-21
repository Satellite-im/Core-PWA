import * as ServerProgram from '~/libraries/Solana/ServerProgram/ServerProgram'

import * as SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import * as web3 from '@solana/web3.js'
describe('ServerProgram.default.isInitialized', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new ServerProgram.default(undefined)
  })

  test('0', () => {
    let result: any = inst2.isInitialized()
    expect(result).toMatchSnapshot()
  })
})

describe('ServerProgram.default.initializeUser', () => {
  let inst10: any
  let inst9: any
  let inst8: any
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst10 = new ServerProgram.default(undefined)
    inst9 = new ServerProgram.default(undefined)
    inst8 = new ServerProgram.default(undefined)
    inst7 = new ServerProgram.default(undefined)
    inst6 = new ServerProgram.default(undefined)
    inst5 = new ServerProgram.default(undefined)
    inst4 = new ServerProgram.default(undefined)
    inst3 = new ServerProgram.default(undefined)
    inst = new ServerProgram.default(undefined)
    inst2 = new ServerProgram.default(undefined)
  })

  test('0', () => {
    let result: any = inst2.initializeUser(
      web3.Keypair.generate(),
      'Jean-Philippe',
      'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
      'processing',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.initializeUser(
      web3.Keypair.generate(),
      'Pierre Edouard',
      'Www.GooGle.com',
      'pending',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst3.initializeUser(
      web3.Keypair.generate(),
      'Michael',
      'https://twitter.com/path?abc',
      'processing',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst4.initializeUser(
      web3.Keypair.generate(),
      'Edmond',
      'https://accounts.google.com/o/oauth2/revoke?token=%s',
      'completed',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst5.initializeUser(
      web3.Keypair.generate(),
      'George',
      'https://',
      'done',
    )
    expect(result).toMatchSnapshot()
  })

  describe('ServerProgram.default.getUserPublicKey', () => {
    let inst2: any

    beforeEach(() => {
      inst2 = new ServerProgram.default(undefined)
    })

    test('0', () => {
      let result: any = inst2.getUserPublicKey(web3.Keypair.generate())
      expect(result).toMatchSnapshot()
    })
  })

  describe('ServerProgram.default.parseUserInfo', () => {
    let inst10: any
    let inst9: any
    let inst8: any
    let inst7: any
    let inst6: any
    let inst5: any
    let inst4: any
    let inst3: any
    let inst: any
    let inst2: any

    beforeEach(() => {
      inst10 = new ServerProgram.default(undefined)
      inst9 = new ServerProgram.default(undefined)
      inst8 = new ServerProgram.default(undefined)
      inst7 = new ServerProgram.default(undefined)
      inst6 = new ServerProgram.default(undefined)
      inst5 = new ServerProgram.default(undefined)
      inst4 = new ServerProgram.default(undefined)
      inst3 = new ServerProgram.default(undefined)
      inst = new ServerProgram.default(undefined)
      inst2 = new ServerProgram.default(undefined)
    })

    test('0', () => {
      let object: any = [
        [
          'https://api.telegram.org/bot',
          'https://croplands.org/app/a/reset?token=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://api.telegram.org/',
        ],
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://croplands.org/app/a/reset?token=',
          'https://twitter.com/path?abc',
          'https://api.telegram.org/bot',
        ],
        [
          'https://croplands.org/app/a/reset?token=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'Www.GooGle.com',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        [
          'Www.GooGle.com',
          'https://twitter.com/path?abc',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'Www.GooGle.com',
        ],
      ]
      let object2: any = [
        [
          'http://base.com',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'http://www.example.com/route/123?foo=bar',
          'http://www.example.com/route/123?foo=bar',
        ],
        [
          'https://croplands.org/app/a/reset?token=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'www.google.com',
          'google.com',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'https://croplands.org/app/a/reset?token=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'http://base.com',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'http://www.example.com/route/123?foo=bar',
          'https://api.telegram.org/',
        ],
      ]
      let object3: any = [
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://twitter.com/path?abc',
          'http://base.com',
          'https://twitter.com/path?abc',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'www.google.com',
          'http://www.croplands.org/account/confirm?t=',
          'https://croplands.org/app/a/confirm?t=',
        ],
        [
          'google.com',
          'https://croplands.org/app/a/confirm?t=',
          'https://api.telegram.org/',
          'https://',
        ],
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://twitter.com/path?abc',
          'http://www.croplands.org/account/confirm?t=',
        ],
      ]
      let object4: any = [
        [
          'Www.GooGle.com',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'Www.GooGle.com',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'http://www.example.com/route/123?foo=bar',
          'http://www.croplands.org/account/confirm?t=',
          'https://api.telegram.org/',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        [
          'https://twitter.com/path?abc',
          'https://croplands.org/app/a/confirm?t=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'Www.GooGle.com',
        ],
        [
          'http://base.com',
          'https://',
          'https://croplands.org/app/a/confirm?t=',
          'http://base.com',
        ],
      ]
      let object5: any = [object, object2, object3, object4]
      let result: any = inst2.parseUserInfo({
        name: 'Michael',
        status: 'canceled',
        photo_hash: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        servers: object5,
      })
      expect(result).toMatchSnapshot()
    })

    test('1', () => {
      let object: any = [
        [
          'google.com',
          'http://www.example.com/route/123?foo=bar',
          'http://www.example.com/route/123?foo=bar',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'https://croplands.org/app/a/reset?token=',
          'https://croplands.org/app/a/reset?token=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://',
        ],
        [
          'Www.GooGle.com',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://',
          'http://www.example.com/route/123?foo=bar',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'http://www.croplands.org/account/confirm?t=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://twitter.com/path?abc',
        ],
      ]
      let object2: any = [
        [
          'http://base.com',
          'http://www.croplands.org/account/confirm?t=',
          'https://api.telegram.org/',
          'www.google.com',
        ],
        [
          'Www.GooGle.com',
          'https://',
          'http://www.croplands.org/account/confirm?t=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'www.google.com',
          'https://api.telegram.org/',
          'https://twitter.com/path?abc',
          'https://api.telegram.org/',
        ],
        [
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://',
          'http://www.croplands.org/account/confirm?t=',
          'https://croplands.org/app/a/confirm?t=',
        ],
      ]
      let object3: any = [
        [
          'Www.GooGle.com',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://api.telegram.org/bot',
          'https://api.telegram.org/bot',
        ],
        [
          'google.com',
          'www.google.com',
          'http://base.com',
          'https://croplands.org/app/a/reset?token=',
        ],
        [
          'http://base.com',
          'http://www.croplands.org/account/confirm?t=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://twitter.com/path?abc',
        ],
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'Www.GooGle.com',
          'www.google.com',
          'https://croplands.org/app/a/reset?token=',
        ],
      ]
      let object4: any = [
        [
          'http://www.croplands.org/account/confirm?t=',
          'https://',
          'http://www.croplands.org/account/confirm?t=',
          'https://twitter.com/path?abc',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'http://www.croplands.org/account/confirm?t=',
          'www.google.com',
          'https://twitter.com/path?abc',
        ],
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://croplands.org/app/a/reset?token=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://api.telegram.org/bot',
        ],
        [
          'http://www.example.com/route/123?foo=bar',
          'https://',
          'https://api.telegram.org/',
          'https://api.telegram.org/bot',
        ],
      ]
      let object5: any = [object, object2, object3, object4]
      let result: any = inst.parseUserInfo({
        name: 'Michael',
        status: 'draft',
        photo_hash:
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        servers: object5,
      })
      expect(result).toMatchSnapshot()
    })

    test('2', () => {
      let object: any = [
        ['https://', 'www.google.com', 'Www.GooGle.com', 'www.google.com'],
        [
          'www.google.com',
          'http://www.example.com/route/123?foo=bar',
          'https://twitter.com/path?abc',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        [
          'Www.GooGle.com',
          'http://www.example.com/route/123?foo=bar',
          'https://twitter.com/path?abc',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        [
          'http://base.com',
          'https://twitter.com/path?abc',
          'https://api.telegram.org/',
          'https://croplands.org/app/a/reset?token=',
        ],
      ]
      let object2: any = [
        [
          'www.google.com',
          'https://',
          'https://croplands.org/app/a/reset?token=',
          'https://',
        ],
        [
          'https://api.telegram.org/bot',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://api.telegram.org/',
        ],
        [
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://croplands.org/app/a/confirm?t=',
          'https://croplands.org/app/a/confirm?t=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://croplands.org/app/a/reset?token=',
          'http://base.com',
          'www.google.com',
        ],
      ]
      let object3: any = [
        [
          'https://',
          'https://api.telegram.org/',
          'http://www.croplands.org/account/confirm?t=',
          'https://',
        ],
        [
          'Www.GooGle.com',
          'https://twitter.com/path?abc',
          'http://base.com',
          'google.com',
        ],
        [
          'https://twitter.com/path?abc',
          'https://twitter.com/path?abc',
          'http://www.example.com/route/123?foo=bar',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://croplands.org/app/a/reset?token=',
          'http://www.croplands.org/account/confirm?t=',
          'https://twitter.com/path?abc',
        ],
      ]
      let object4: any = [
        [
          'https://croplands.org/app/a/confirm?t=',
          'www.google.com',
          'Www.GooGle.com',
          'https://api.telegram.org/bot',
        ],
        [
          'Www.GooGle.com',
          'https://',
          'https://croplands.org/app/a/confirm?t=',
          'http://www.croplands.org/account/confirm?t=',
        ],
        [
          'https://croplands.org/app/a/confirm?t=',
          'google.com',
          'google.com',
          'https://',
        ],
        [
          'https://',
          'https://croplands.org/app/a/reset?token=',
          'http://base.com',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
      ]
      let object5: any = [object, object2, object3, object4]
      let result: any = inst3.parseUserInfo({
        name: 'Jean-Philippe',
        status: 'done',
        photo_hash:
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        servers: object5,
      })
      expect(result).toMatchSnapshot()
    })

    test('3', () => {
      let object: any = [
        [
          'https://',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'http://www.croplands.org/account/confirm?t=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'google.com',
          'https://twitter.com/path?abc',
          'http://www.croplands.org/account/confirm?t=',
        ],
        [
          'www.google.com',
          'https://api.telegram.org/bot',
          'http://www.croplands.org/account/confirm?t=',
          'https://croplands.org/app/a/reset?token=',
        ],
        [
          'Www.GooGle.com',
          'https://api.telegram.org/bot',
          'https://croplands.org/app/a/confirm?t=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
      ]
      let object2: any = [
        [
          'google.com',
          'http://base.com',
          'https://api.telegram.org/',
          'https://croplands.org/app/a/confirm?t=',
        ],
        [
          'Www.GooGle.com',
          'http://www.example.com/route/123?foo=bar',
          'http://base.com',
          'http://base.com',
        ],
        [
          'Www.GooGle.com',
          'https://croplands.org/app/a/confirm?t=',
          'http://www.croplands.org/account/confirm?t=',
          'https://croplands.org/app/a/reset?token=',
        ],
        [
          'http://www.example.com/route/123?foo=bar',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'google.com',
        ],
      ]
      let object3: any = [
        [
          'https://twitter.com/path?abc',
          'www.google.com',
          'https://api.telegram.org/bot',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        ],
        [
          'https://api.telegram.org/',
          'https://',
          'https://croplands.org/app/a/reset?token=',
          'www.google.com',
        ],
        [
          'google.com',
          'https://croplands.org/app/a/confirm?t=',
          'Www.GooGle.com',
          'google.com',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'google.com',
          'https://api.telegram.org/',
          'google.com',
        ],
      ]
      let object4: any = [
        [
          'https://croplands.org/app/a/reset?token=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'http://www.croplands.org/account/confirm?t=',
        ],
        [
          'https://api.telegram.org/',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://twitter.com/path?abc',
          'google.com',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'www.google.com',
          'http://www.example.com/route/123?foo=bar',
          'https://croplands.org/app/a/confirm?t=',
        ],
        [
          'https://twitter.com/path?abc',
          'https://croplands.org/app/a/confirm?t=',
          'https://',
          'https://croplands.org/app/a/confirm?t=',
        ],
      ]
      let object5: any = [object, object2, object3, object4]
      let result: any = inst4.parseUserInfo({
        name: 'Michael',
        status: 'processing',
        photo_hash: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        servers: object5,
      })
      expect(result).toMatchSnapshot()
    })

    test('4', () => {
      let object: any = [
        [
          'https://',
          'http://www.example.com/route/123?foo=bar',
          'google.com',
          'http://base.com',
        ],
        [
          'Www.GooGle.com',
          'https://twitter.com/path?abc',
          'https://croplands.org/app/a/reset?token=',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        ['www.google.com', 'google.com', 'http://base.com', 'google.com'],
        [
          'http://www.example.com/route/123?foo=bar',
          'https://',
          'https://api.telegram.org/',
          'https://',
        ],
      ]
      let object2: any = [
        [
          'https://api.telegram.org/bot',
          'google.com',
          'https://api.telegram.org/',
          'https://api.telegram.org/bot',
        ],
        [
          'http://www.example.com/route/123?foo=bar',
          'google.com',
          'https://api.telegram.org/bot',
          'http://www.example.com/route/123?foo=bar',
        ],
        [
          'www.google.com',
          'https://croplands.org/app/a/confirm?t=',
          'google.com',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
        ],
        [
          'http://www.example.com/route/123?foo=bar',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://api.telegram.org/bot',
          'www.google.com',
        ],
      ]
      let object3: any = [
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://api.telegram.org/bot',
          'https://api.telegram.org/',
          'google.com',
        ],
        [
          'http://base.com',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://',
          'https://',
        ],
        [
          'https://croplands.org/app/a/reset?token=',
          'https://api.telegram.org/',
          'https://accounts.google.com/o/oauth2/revoke?token=%s',
          'https://croplands.org/app/a/reset?token=',
        ],
        [
          'http://www.croplands.org/account/confirm?t=',
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'https://',
          'https://api.telegram.org/',
        ],
      ]
      let object4: any = [
        [
          'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
          'http://www.croplands.org/account/confirm?t=',
          'Www.GooGle.com',
          'http://www.example.com/route/123?foo=bar',
        ],
        [
          'https://',
          'https://api.telegram.org/',
          'http://base.com',
          'http://www.example.com/route/123?foo=bar',
        ],
        [
          'https://api.telegram.org/',
          'http://www.example.com/route/123?foo=bar',
          'https://',
          'https://api.telegram.org/',
        ],
        [
          'https://twitter.com/path?abc',
          'https://',
          'www.google.com',
          'https://croplands.org/app/a/confirm?t=',
        ],
      ]
      let object5: any = [object, object2, object3, object4]
      let result: any = inst5.parseUserInfo({
        name: 'Anas',
        status: 'pending',
        photo_hash: 'https://croplands.org/app/a/confirm?t=',
        servers: object5,
      })
      expect(result).toMatchSnapshot()
    })

    test('5', () => {
      let result: any = inst10.parseUserInfo({
        name: '',
        status: '',
        photo_hash: '',
        servers: [],
      })
      expect(result).toMatchSnapshot()
    })
  })
})
