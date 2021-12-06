import { PrerequisiteState } from './types'

const InitialPrerequisitesState = (): PrerequisiteState => ({
  accountsReady: false,
  p2pReady: true,
  textileReady: false,
})

export default InitialPrerequisitesState
