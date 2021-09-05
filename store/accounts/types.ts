export enum RegistrationStatus {
  UKNOWN = 'unknown',
  IN_PROGRESS = 'in_progress',
  FUNDING_ACCOUNT = 'funding_account',
  SENDING_TRANSACTION = 'sending_transaction',
  REGISTERED = 'registered',
}

export interface AccountsState {
  loading?: boolean
  locked: boolean
  pin?: string
  pinHash: string
  active: string
  gasPrice: string
  phrase: string
  error: string
  encryptedPhrase: string
  registered: boolean
  registrationStatus: RegistrationStatus
}

export enum AccountsError {
  INVALID_PIN = 'errors.accounts.invalid_pin',
  PIN_TOO_SHORT = 'errors.accounts.pin_too_short',
  UNABLE_TO_CREATE_MNEMONIC = 'errors.accounts.unable_to_create_mnemonic',
  MNEMONIC_NOT_PRESENT = 'errors.accounts.mnemonic_not_present',
  USER_DERIVATION_FAILED = 'errors.accounts.user_derivation_failed',
  USER_NOT_REGISTERED = 'errors.accounts.user_not_registered',
  USER_ALREADY_REGISTERED = 'errors.accounts.user_already_registered',
  PAYER_NOT_PRESENT = 'errors.accounts.payer_not_present',
}

export interface UserRegistrationPayload {
  name: string
  photoHash: string
  status: string
}
