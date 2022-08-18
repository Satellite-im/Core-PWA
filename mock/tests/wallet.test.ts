import { expect } from '@jest/globals'
import * as Wallet from '../wallet'

describe('init', () => {
  it('gets the Details constant', () => {
    expect(Wallet.Details).toMatchSnapshot()
  })
  it('gets the LinkedAccounts constant', () => {
    expect(Wallet.LinkedAccounts).toMatchSnapshot()
  })
  it('gets the RecentTransactions constant', () => {
    expect(Wallet.RecentTransactions).toMatchSnapshot()
  })
})
