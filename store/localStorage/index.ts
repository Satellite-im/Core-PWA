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
})
