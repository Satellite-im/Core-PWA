import { AccountsState } from './types'

const InitalAccountsState = (): AccountsState => ({
  locked: false,
  error: '',
  pinHash: '',
  active: '',
  gasPrice: '',
  phrase: '',
  encryptedPhrase: '',
  loading: false,
})

export default InitalAccountsState
