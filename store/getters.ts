import { RootState } from '~/types/store/store'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    console.info(
      'checking ready state',
      state.accounts.active,
      state.webrtc.initialized,
    )
    return Boolean(state.accounts.active) && state.webrtc.initialized
  },
}

export default getters
