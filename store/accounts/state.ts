import { AccountsState, RegistrationStatus } from './types'

const InitialAccountsState = (): AccountsState => ({
  storePin: false,
  locked: true,
  error: '',
  pinHash: '',
  active: '',
  gasPrice: '',
  phrase: '',
  encryptedPhrase: '',
  loading: false,
  registered: false,
  registrationStatus: RegistrationStatus.UNKNOWN,
  lastVisited: '',
})

export default InitialAccountsState
