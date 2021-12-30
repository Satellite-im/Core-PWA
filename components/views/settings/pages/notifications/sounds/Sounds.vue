<template src="./Sounds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SoundsTypes } from '../../../../../../store/sounds/types'

export default Vue.extend({
  name: 'NotificationsSettingsSounds',
  layout: 'sounds',
  computed: {
    ...mapState(['sounds']),
    message: {
      get() {
        return this.sounds.message
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.message, value })
      },
    },
    call: {
      get() {
        return this.sounds.call
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.call, value })
      },
    },
    mute: {
      get() {
        return this.sounds.mute
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.mute, value })
      },
    },
    deafen: {
      get() {
        return this.sounds.deafen
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.deafen, value })
      },
    },
    undeafen: {
      get() {
        return this.sounds.undeafen
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.undeafen, value })
      },
    },
    upload: {
      get() {
        return this.sounds.upload
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.upload, value })
      },
    },
    connected: {
      get() {
        return this.sounds.connected
      },
      set(value: Boolean) {
        this.$store.commit('sounds/set', { key: SoundsTypes.connected, value })
      },
    },
  },
  mounted() {},
})
</script>

<style lang="less" scoped src="./Sounds.less"></style>
