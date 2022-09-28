import PhantomAdapter from './PhantomAdapter'

jest.mock('@solana/web3.js')
jest.mock('../../interfaces')
jest.mock('~/libraries/Phantom/PhantomManager')

describe('PhantomAdapter', () => {
  let instance: PhantomAdapter

  beforeEach(() => {
    instance = new PhantomAdapter()
  })

  it('instance should be an instanceof PhantomAdapter', () => {
    expect(instance instanceof PhantomAdapter).toBeTruthy()
  })
})
