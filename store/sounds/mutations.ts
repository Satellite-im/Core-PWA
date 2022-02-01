import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { SoundsState } from './types'

const mutations = {
  set(state: SoundsState, { key, value }: { key: Sounds; value: boolean }) {
    state[key] = value
  },
}

export default mutations
