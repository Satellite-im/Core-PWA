import { Store } from 'vuex'
import { AccountsState } from './accounts/types'

export interface RootState {
  accounts: AccountsState
}

export type RootStore = Store<RootState>
