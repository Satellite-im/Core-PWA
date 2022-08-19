import { RootState } from '~/types/store/store'

const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    console.info('checking ready state', state.accounts.active)
    return Boolean(state.accounts.active)
  },
}

export default getters
