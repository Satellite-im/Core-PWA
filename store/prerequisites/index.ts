interface PrerequisiteState {
  stateLoaded: Boolean
  peer2PeerBound: Boolean
  blockchainBound: Boolean
}

const InitalPrerequisitesState: PrerequisiteState = {
  stateLoaded: true,
  peer2PeerBound: false,
  blockchainBound: false,
}

export const state = () => ({
  ...InitalPrerequisitesState,
})
