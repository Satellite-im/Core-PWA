import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

let ready = false
iridium.on('ready', () => {
  ready = true
})
const getters = {
  allPrerequisitesReady: (state: RootState): boolean => {
    return ready
  },
}

export default getters
