// eslint-disable-next-line import/named
import { Store, Commit, Dispatch } from 'vuex'
import { AccountsState } from '~/store/accounts/types'
import { DataState } from '~/store/dataState/types'
import { FriendsState } from '~/store/friends/types'
import { TextileState } from '~/store/textile/types'
import { UIState } from '~/store/ui/types'
import { WebRTCState } from '~/store/webrtc/types'
import { GroupsState } from '~/store/groups/types'

export interface RootState {
  accounts: AccountsState
  dataState: DataState
  friends: FriendsState
  textile: TextileState
  webrtc: WebRTCState
  groups: GroupsState
  ui: UIState
}

export type RootStore = Store<RootState>

export type ActionsArguments<StateType> = {
  commit: Commit
  state: StateType
  dispatch: Dispatch
  rootState: RootState
}
