import * as TextileManager from '~/libraries/Textile/TextileManager'
const TextileManagerDefault = TextileManager.default

describe('TextileManager.default.getIdentityPublicKey', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new TextileManagerDefault()
  })

  test('0', () => {
    const result: any = inst2.getIdentityPublicKey()
    expect(result).toMatchSnapshot()
  })
})
