import { NuxtState } from '@nuxt/types/app'

const mutations = {
  toggleCamera(state: NuxtState) {
    const isDisabled = state.video.disabled
    state.video = {
      ...state.video,
      disabled: !isDisabled,
    }
  },
}

export default mutations
