export interface TextileState {
  initialized: boolean
  mailboxId: string
}

export enum TextileError {
  INVALID_PIN = 'errors.accounts.invalid_pin',
}
