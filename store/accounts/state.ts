import { AccountsState } from './types'

const InitalAccountsState: AccountsState = {
  locked: true,
  error: '',
  pinHash: '',
  active: '',
  gasPrice: '',
  phrase: '',
  encryptedPhrase: '',
}

export default InitalAccountsState
