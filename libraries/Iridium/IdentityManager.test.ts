import IdentityManager from './IdentityManager'

describe('IdentityManager', () => {
  let instance: IdentityManager

  beforeEach(() => {
    instance = new IdentityManager()
  })

  it('instance should be an instanceof IdentityManager', () => {
    expect(instance instanceof IdentityManager).toBeTruthy()
  })
})