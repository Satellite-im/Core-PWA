import { AccountsState, RegistrationStatus } from './types'

const InitalAccountsState = (): AccountsState => ({
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
  registrationStatus: RegistrationStatus.UKNOWN,
})

export default InitalAccountsState
