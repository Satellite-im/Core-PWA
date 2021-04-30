interface PrerequisiteStateD {
  peer2PeerBound: Boolean
  blockchainBound: Boolean
  friendsLoaded: Boolean
}

const PrerequisiteState: PrerequisiteStateD = {
  peer2PeerBound: false,
  blockchainBound: false,
  friendsLoaded: false,
}

interface State {
  prerequisites: PrerequisiteStateD
}

export const Prerequisites: State = {
  prerequisites: {
    ...PrerequisiteState,
  },
}
