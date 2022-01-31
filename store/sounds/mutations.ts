import { SoundsState, SoundsTypes } from './types'

const mutations = {
  set(
    state: SoundsState,
    { key, value }: { key: SoundsTypes; value: Boolean },
  ) {
    state[key] = value
  },
}

export default mutations
