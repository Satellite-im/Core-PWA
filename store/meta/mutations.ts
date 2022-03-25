import { MetaState } from './types'

const mutations = {
  setTitle(state: MetaState, title: string) {
    state.title = title
  },
}

export default mutations
