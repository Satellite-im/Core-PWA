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
})
</script>

<style scoped lang="less" src="./Card.less"></style>
