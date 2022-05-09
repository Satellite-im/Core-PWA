import { RootState } from '~/types/store/store'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    return Boolean(state.accounts.active) && state.webrtc.initialized
  },
}

export default getters
