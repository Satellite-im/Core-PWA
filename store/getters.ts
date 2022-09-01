import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    console.info(
      'checking ready state',
      state.accounts.details?.did,
      iridium.ready,
    )
    return Boolean(iridium.ready && state.accounts.details?.did)
  },
}

export default getters
