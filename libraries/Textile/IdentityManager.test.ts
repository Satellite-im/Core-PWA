import * as IdentityManager from '~/libraries/Textile/IdentityManager'
describe('IdentityManager.default.generateMessageForEntropy', () => {
  let inst: any

  beforeEach(() => {
    inst = new IdentityManager.default()
  })

  test('0', () => {
    let result: any = inst.generateMessageForEntropy(
      '192.168.1.5',
      '!Lov3MyPianoPony',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = inst.generateMessageForEntropy(
      '0.0.0.0',
      'accessdenied4u',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = inst.generateMessageForEntropy(
      '192.168.1.5',
      'NoWiFi4you',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = inst.generateMessageForEntropy(
      '0.0.0.0',
      'YouarenotAllowed2Use',
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = inst.generateMessageForEntropy('0.0.0.0', 'NoWiFi4you')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = inst.generateMessageForEntropy('', '')
    expect(result).toMatchSnapshot()
  })
})

describe('IdentityManager.default.createRandom', () => {
  let inst: any

  beforeEach(() => {
    inst = new IdentityManager.default()
  })

  test('0', async () => {
    await inst.createRandom()
  })
})

describe('IdentityManager.default.isInitialized', () => {
  let inst: any

  beforeEach(() => {
    inst = new IdentityManager.default()
  })

  test('0', () => {
    let result: any = inst.isInitialized()
    expect(result).toMatchSnapshot()
  })
})
