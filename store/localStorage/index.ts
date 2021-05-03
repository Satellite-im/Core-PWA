import { InitalSettingsState } from './settings'
import { InitalAccountsState } from './accounts'

interface PersistedState {
  pin: String
  encryptedPin: String
}

const InitalPersistedState: PersistedState = {
  pin: '',
  encryptedPin: '',
}

export const state = () => ({
  ...InitalPersistedState,
  ...InitalSettingsState,
  ...InitalAccountsState,
})
