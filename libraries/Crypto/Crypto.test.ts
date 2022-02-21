import * as Crypto from '~/libraries/Crypto/Crypto'
import * as web3 from '@solana/web3.js'
describe('Crypto.default.init', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('0', () => {
    let result: any = inst.init(web3.Keypair.generate())
    expect(result).toMatchSnapshot()
  })
})

describe('Crypto.default.computeSharedSecret', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('1', () => {
    let param1: any = new web3.PublicKey(10)
    let result: any = inst.computeSharedSecret(param1)
    expect(result).toMatchSnapshot()
  })
})

describe('Crypto.default.joinIvAndData', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('0', () => {
    let param1: any = new Uint8Array([])
    let param2: any = new Uint8Array([])
    let result: any = inst.joinIvAndData(param1, param2)
    expect(result).toMatchSnapshot()
  })
})

describe('Crypto.default.getSecret', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('0', () => {
    let result: any = inst.getSecret('192.168.1.5')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.getSecret('0.0.0.0')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst.getSecret('')
    expect(result).toMatchSnapshot()
  })
})

describe('Crypto.default.signMessageWithKey', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('0', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(param1, 'Error:')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(
      param1,
      'Wait time out reached, while waiting for results',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(param1, 'Unknown Error')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(
      param1,
      'Missing FileUri configuration',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(
      param1,
      'TypeError exception should be raised',
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let param1: any = new Uint8Array([])
    let result: any = inst.signMessageWithKey(param1, '')
    expect(result).toMatchSnapshot()
  })
})

describe('Crypto.default.signMessage', () => {
  let inst: any

  beforeEach(() => {
    inst = new Crypto.default()
  })

  test('0', () => {
    let result: any = inst.signMessage('New Error ')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.signMessage('\n\nThe first error message:\n')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst.signMessage('<error_message>%s</error_message>')
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst.signMessage(
      "Top level object in 'override.yml' needs to be an object",
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst.signMessage('cannot be found.')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst.signMessage('')
    expect(result).toMatchSnapshot()
  })
})
