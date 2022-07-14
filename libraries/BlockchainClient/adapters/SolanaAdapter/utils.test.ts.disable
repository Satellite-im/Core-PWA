import * as utils from '~/libraries/BlockchainClient/adapters/SolanaAdapter/utils'

describe('utils.accountFromWallet', () => {
  test('0', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: '$p3onyycat' },
      address: '192.168.1.5',
      mnemonic: 'NoWiFi4you',
      path: '.',
    })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: '$p3onyycat' },
      address: '192.168.1.5',
      mnemonic: '$p3onyycat',
      path: 'path/to/folder/',
    })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: 'accessdenied4u' },
      address: '192.168.1.5',
      mnemonic: '$p3onyycat',
      path: 'path/to/file.ext',
    })
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: '!Lov3MyPianoPony' },
      address: '192.168.1.5',
      mnemonic: 'accessdenied4u',
      path: 'path/to/folder/',
    })
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: '$p3onyycat' },
      address: '0.0.0.0',
      mnemonic: 'YouarenotAllowed2Use',
      path: 'path/to/folder/',
    })
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = utils.accountFromWallet({
      keypair: { secretKey: '' },
      address: '',
      mnemonic: '',
      path: '',
    })
    expect(result).toMatchSnapshot()
  })
})
