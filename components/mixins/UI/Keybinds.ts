// @ts-nocheck
import Mousetrap from 'mousetrap'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export const Keybinds = {
  mounted() {
    if (this.$options.name === 'Nuxt') {
      this.activateKeybinds()
    }
  },
  methods: {
    /**
     * @method activateKeybinds
     * @description Activates all keybindings with Mousetrap
     * @example
     */
    activateKeybinds() {
      Mousetrap.reset()
      Mousetrap.bind(
        this.$store.state.settings.keybinds.toggleMute,
        this.toggleMute
      )
      Mousetrap.bind(
        this.$store.state.settings.keybinds.toggleDeafen,
        this.toggleDeafen
      )
      Mousetrap.bind(
        this.$store.state.settings.keybinds.openSettings,
        this.openSettings
      )
      Mousetrap.bind(
        this.$store.state.settings.keybinds.callActiveChat,
        this.callActiveChat
      )
    },
    /**
     * @method clearKeybinds
     * @description Unbinds all current keybindings with Mousetrap
     * @example
     */
    clearKeybinds() {
      Mousetrap.reset()
    },
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example
     */
    toggleMute() {
      const muted = this.$store.state.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)
      this.$store.commit('mute')
    },
    /**
     * @method toggleDeafen
     * @description Toggles deafen for incoming audio
     * @example
     */
    toggleDeafen() {
      const deafened = this.$store.state.audio.deafened
      if (!deafened) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)
      this.$store.commit('deafen')
    },
    /**
     * @method openSettings
     * @description Opens setting page
     * @example
     */
    openSettings() {
      const showSettings = this.$store.state.ui.showSettings
      this.$store.commit('toggleSettings', !showSettings)
    },
    /**
     * @method callActiveChat
     * @description
     * @example
     */
    callActiveChat() {},
  },
}

export default Keybinds