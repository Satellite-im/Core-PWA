import SolanaAdapter from './SolanaAdapter'

describe('SolanaAdapter', () => {
  let instance: SolanaAdapter

  beforeEach(() => {
    instance = new SolanaAdapter()
  })

  it('instance should be an instanceof SolanaAdapter', () => {
    expect(instance instanceof SolanaAdapter).toBeTruthy()
  })
})
