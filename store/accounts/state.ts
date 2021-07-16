import { v4 as uuidv4 } from 'uuid'

interface AccountsState {
  active: String
  gasPrice: String
  phrase: String
}

const InitalAccountsState: AccountsState = {
  // TODO: remove this when Solana accounts are integrated
  active: uuidv4(),
  gasPrice: '31',
  phrase:
    'truth brown crater taste unable cup modify brass today valley opera moment',
}

export default InitalAccountsState
