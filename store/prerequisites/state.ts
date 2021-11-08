import { PrerequisiteState } from './types'

const InitalPrerequisitesState = (): PrerequisiteState => ({
  accountsReady: false,
  p2pReady: true,
  textileReady: false,
})

export default InitalPrerequisitesState
