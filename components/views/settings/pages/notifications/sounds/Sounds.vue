<template src="./Sounds.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SoundsTypes } from '~/store/sounds/types'

export default Vue.extend({
  name: 'NotificationsSettingsSounds',
  layout: 'sounds',
  data() {
    return {
      SoundsTypes,
    }
  },
  computed: {
    ...mapState(['sounds']),
  },
  methods: {
    sound(key: SoundsTypes) {
      return this.sounds[key]
    },
    toggleSound(key: SoundsTypes, value: boolean) {
      this.$store.commit('sounds/set', { key: SoundsTypes[key], value })
    },
  },
  mounted() {},
})
</script>

<style lang="less" scoped src="./Sounds.less"></style>
