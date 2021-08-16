import { AccountsState } from './types'

const InitalAccountsState = (): AccountsState => ({
  locked: false,
  error: '',
  pinHash: '',
  active: '',
  gasPrice: '',
  phrase: '',
  encryptedPhrase: '',
})

export default InitalAccountsState
