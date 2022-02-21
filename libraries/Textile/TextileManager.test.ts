import * as TextileManager from '~/libraries/Textile/TextileManager'

describe('TextileManager.default.getIdentityPublicKey', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new TextileManager.default()
  })

  test('0', () => {
    let result: any = inst2.getIdentityPublicKey()
    expect(result).toMatchSnapshot()
  })
})
