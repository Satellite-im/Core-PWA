<template src="./Card.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ProfileInfo } from '~/types/profile/profile'

export default Vue.extend({
  props: {
    info: {
      type: Object as PropType<ProfileInfo>,
      default: null,
    },
  },
  data() {
    return {
      languages: [],
    }
  },
})
</script>

<style lang="less" src="./Card.less" scoped></style>
