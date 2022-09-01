import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    return ![
      iridium.ready,
      !!iridium.profile.state?.did,
      !!state.accounts.details?.did,
    ].some((value) => !value)
  },
}

export default getters
