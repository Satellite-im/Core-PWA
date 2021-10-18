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
     * @example mounted (){ activateKeybinds() }
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
     * @example destroyed (){ clearKeybinds() }
     */
    clearKeybinds() {
      Mousetrap.reset()
    },
    /**
     * @method toggleMute
     * @description Toggles mute for outgoing audio
     * @example Mousetrap.bind('ctrl+m', this.toggleMute )
     */
    toggleMute() {
      const muted = this.$store.state.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)
      this.$store.commit('audio/mute')
    },
    /**
     * @method toggleDeafen
     * @description Toggles deafen for incoming audio
     * @example Mousetrap.bind('ctrl+d', this.toggleDeafen )
     */
    toggleDeafen() {
      const deafened = this.$store.state.audio.deafened
      if (!deafened) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)
      this.$store.commit('audio/deafen')
    },
    /**
     * @method openSettings
     * @description Opens setting page
     * @example Mousetrap.bind('ctrl+s', this.openSettings )
     */
    openSettings() {
      const showSettings = this.$store.state.ui.showSettings
      this.$store.commit('ui/toggleSettings', !showSettings)
    },
    /**
     * @method callActiveChat
     * @description Makes P2P call to current chat
     * @example Mousetrap.bind('ctrl+c', this.callActiveChat )
     */
    callActiveChat() {},
  },
}

export default Keybinds
