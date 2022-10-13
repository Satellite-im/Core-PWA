import { AccountsState, RegistrationStatus } from './types'

const InitialAccountsState = (): AccountsState => ({
  initialized: false,
  storePin: false,
  registry: false,
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
  adapter: '',
  entropyMessage: '',
  isNewAccount: false,
})

export default InitialAccountsState
