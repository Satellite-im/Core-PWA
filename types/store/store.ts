// eslint-disable-next-line import/named
import { Store, Commit, Dispatch } from 'vuex'
import { AccountsState } from '~/store/accounts/types'
import { DataState } from '~/store/dataState/types'
import { FriendsState } from '~/store/friends/types'
import { PrerequisiteState } from '~/store/prerequisites/types'
import { TextileState } from '~/store/textile/types'

export interface RootState {
  accounts: AccountsState
  dataState: DataState
  friends: FriendsState
  textile: TextileState
  prerequisites: PrerequisiteState
}

export type RootStore = Store<RootState>

export type ActionsArguments<StateType> = {
  commit: Commit
  state: StateType
  dispatch: Dispatch
  rootState: RootState
}
