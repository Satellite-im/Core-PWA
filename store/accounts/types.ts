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
}

export enum AccountsError {
  INVALID_PIN = 'errors.accounts.invalid_pin',
  PIN_TOO_SHORT = 'errors.accounts.pin_too_short',
}
