// eslint-disable-next-line import/named
import { Store, Commit, Dispatch } from 'vuex'
import { AccountsState } from './accounts/types'
import { DataState } from './dataState/types'
import { FriendsState } from './friends/types'

export interface RootState {
  accounts: AccountsState
  dataState: DataState
  friends: FriendsState
}

export type RootStore = Store<RootState>

export interface ActionsArguments {
  commit: Commit
  state: RootState
  dispatch: Dispatch
}
