<template>
  <div class="img-container">
    <img
      v-if="url"
      :src="url"
      :class="`${!bannerUrlExists ? 'img-default' : ''}`"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { sampleProfileInfo } from '~/mock/profile'

export default Vue.extend({
  computed: {
    url: () => sampleProfileInfo.bannerUrl || sampleProfileInfo.imageUrl,
    bannerUrlExists: () => !!sampleProfileInfo.bannerUrl,
    sampleProfileInfo: () => sampleProfileInfo,
  },
})
</script>

<style scoped lang="less">
.img-container {
  overflow: hidden;
  background-color: @gray;

  img {
    height: 300px;
    width: 100%;
    object-fit: cover;
    transform: scale(1.05);
  }
}

.img-default {
  filter: blur(4px);
}
</style>
