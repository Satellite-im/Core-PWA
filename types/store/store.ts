import { Store, Commit, Dispatch } from 'vuex'
import { AccountsState } from '~/store/accounts/types'
import { UIState } from '~/store/ui/types'
import { SettingsState } from '~/store/settings/types'
import { AudioState } from '~/store/audio/types'
import { VideoState } from '~/store/video/types'
import { ChatState } from '~/store/chat/types'
import { SoundsState } from '~/store/sounds/types'
import { FilesState } from '~/store/files/types'

export interface RootState {
  accounts: AccountsState
  audio: AudioState
  chat: ChatState
  files: FilesState
  settings: SettingsState
  sounds: SoundsState
  ui: UIState
  video: VideoState
}

export type RootStore = Store<RootState>

export type ActionsArguments<StateType, GetterType = any> = {
  commit: Commit
  state: StateType
  dispatch: Dispatch
  rootState: RootState
  getters: {
    // @ts-ignore fix later by requiring a getter type after building it for other namespaces
    [K in keyof GetterType]: ReturnType<GetterType[K]>
  }
}
