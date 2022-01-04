<template src="./Card.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ProfileInfo } from '~/types/profile/profile'
import { recommendLocations } from '~/mock/profile'

export default Vue.extend({
  props: {
    info: {
      type: Object as PropType<ProfileInfo>,
      default: null,
    },
  },
  data() {
    return {
      locations: [],
      languages: [],
      recommendLocations,
    }
  },
  mounted() {
    this.getUserTimeZone()
  },
  methods: {
    /**
     * @method getUserTimeZone
     * @description Auto grabs users location/timezone, we check the locations array to ensure location hasn't already been added which fixes a multiple input bug
     * @example Intl.DateTimeFormat().resolvedOptions().timeZone
     */
    getUserTimeZone() {
      if (this.info.locations.indexOf(Intl.DateTimeFormat().resolvedOptions().timeZone) === -1) {
      this.info.locations.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
      },
  },
})
</script>

<style scoped lang="less" src="./Card.less"></style>
