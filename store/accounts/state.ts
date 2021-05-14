interface AccountsState {
  active: String
  gasPrice: String
  phrase: String
}

const InitalAccountsState: AccountsState = {
  active: '0x0000000000000000000000000000000000000000',
  gasPrice: '31',
  phrase:
    'truth brown crater taste unable cup modify brass today valley opera moment',
}

export default InitalAccountsState
