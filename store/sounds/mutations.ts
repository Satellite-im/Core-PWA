import { SoundsState } from './types'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

const mutations = {
  set(state: SoundsState, { key, value }: { key: Sounds; value: boolean }) {
    state[key] = value
  },
}

export default mutations
