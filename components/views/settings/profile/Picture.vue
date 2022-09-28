<template>
  <div class="img-container">
    <img v-if="url" :src="url" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleProfileInfo } from '~/mock/profile'

export default Vue.extend({
  computed: {
    url: () => sampleProfileInfo.imageUrl,
    sampleProfileInfo: () => sampleProfileInfo,
  },
})
</script>

<style scoped lang="less">
.img-container {
  background-color: @gray;
  border-radius: @corner-rounding @corner-rounding 0 0;
  overflow: hidden;
  height: 300px;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
