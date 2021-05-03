interface AccountsState {
  activeAccount: String
  gasPrice: String
}

export const InitalAccountsState: AccountsState = {
  activeAccount: '0x0000000000000000000000000000000000000000',
  gasPrice: '31',
}
