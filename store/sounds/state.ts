import { SoundsState } from "./types"

const InitialSettingsState = (): SoundsState => ({
  message: true,
  call: true,
  mute: true,
  deafen: true,
  undeafen: true,
  upload: true,
  connected: true,
})

export default InitialSettingsState