import { RootState } from '~/types/store/store'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    return (
      Boolean(state.accounts.active) &&
      state.textile.initialized &&
      state.webrtc.initialized
    )
  },
}

export default getters
