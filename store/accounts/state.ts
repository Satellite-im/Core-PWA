import { AccountsState, RegistrationStatus } from './types'

const InitialAccountsState = (): AccountsState => ({
  initialized: false,
  storePin: false,
  registry: true,
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
  lastVisited: '/',
})

export default InitialAccountsState
