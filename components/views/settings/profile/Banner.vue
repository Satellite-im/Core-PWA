<template>
  <img :src="sampleProfileInfo.imageUrl" />
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleProfileInfo } from '~/mock/profile'

export default Vue.extend({
  computed: {
    sampleProfileInfo: () => sampleProfileInfo,
  },
})
</script>

<style scoped lang="less">
img {
  height: 330px;
  width: 100%;
  object-fit: cover;
  border-radius: 0 @corner-rounding;
}
</style>
