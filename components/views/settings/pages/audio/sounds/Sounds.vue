<template src="./Sounds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  name: 'NotificationsSettingsSounds',
  layout: 'sounds',
  data() {
    return {
      Sounds,
    }
  },
  computed: {
    ...mapState(['sounds']),
  },
  mounted() {},
  methods: {
    sound(key: Sounds) {
      return this.sounds[key]
    },
    toggleSound(key: Sounds, value: boolean) {
      this.$store.commit('sounds/set', { key, value })
    },
    toggleSounds(keys: Sounds[], value: boolean) {
      for (const key of keys) {
        this.$store.commit('sounds/set', { key, value })
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Sounds.less"></style>
