import SolanaAdapter from './SolanaAdapter'

jest.mock('@solana/web3.js')
jest.mock('tweetnacl')
jest.mock('../../interfaces')
jest.mock('./utils')
jest.mock('~/libraries/Solana/SolanaManager/SolanaManager')
jest.mock('~/libraries/Solana/FriendsProgram/FriendsProgram')
jest.mock('~/libraries/Solana/GroupChatsProgram/GroupChatsProgram')
jest.mock('~/libraries/Solana/FriendsProgram/FriendsProgram.types')
jest.mock('~/store/accounts/types')
jest.mock('~/libraries/Solana/UsersProgram/UsersProgram')

// adding the mocks above for future tests

describe('SolanaAdapter', () => {
  let instance

  beforeEach(() => {
    instance = new SolanaAdapter()
  })

  it('instance should be an instanceof SolanaAdapter', () => {
    expect(instance instanceof SolanaAdapter).toBeTruthy()
  })
})
