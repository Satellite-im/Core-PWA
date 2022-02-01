import { PrerequisiteState } from './types'

const getters = {
  allPrerequisitesReady: (state: PrerequisiteState): boolean => {
    return Object.values(state).reduce(
      (stateLoaded, prerequisite) => stateLoaded && prerequisite,
      true,
    )
  },
}

export default getters
