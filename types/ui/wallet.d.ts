export type Transaction = {
  id: string
  user: {
    name: string
    address: string
  }
  memo: string
  state: string
  at: number
  direction: string
  amount: number
}

export type AccountType = 'credit-card' | 'local' | 'hardware'

export type Account = {
  type: AccountType
  icon: string
  name: string
  number: number
}
