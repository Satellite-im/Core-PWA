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
    clearKeybinds() {
      Mousetrap.reset()
    },
    toggleMute() {
      const muted = this.$store.state.audio.muted
      if (!muted) this.$Sounds.playSound(Sounds.MUTE)
      else this.$Sounds.playSound(Sounds.UNMUTE)
      this.$store.commit('mute')
    },
    toggleDeafen() {
      const deafened = this.$store.state.audio.deafened
      if (!deafened) this.$Sounds.playSound(Sounds.DEAFEN)
      else this.$Sounds.playSound(Sounds.UNDEAFEN)
      this.$store.commit('deafen')
    },
    openSettings() {
      const showSettings = this.$store.state.ui.showSettings
      this.$store.commit('toggleSettings', !showSettings)
    },
    callActiveChat() {},
  },
}
