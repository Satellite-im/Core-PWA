<template>
  <div class="image-container" :class="{ nsfw: nsfw && blockNsfw }">
    <slot />
  </div>
</template>

<script lang="ts">
import iridium from '~/libraries/Iridium/IridiumManager'

export default {
  props: {
    nsfw: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    blockNsfw(): boolean {
      return iridium.settings.state.privacy.blockNsfw
    },
  },
}
</script>

<style lang="less" scoped>
.image-container {
  overflow: hidden;
  background-color: #fff;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%
    ),
    linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;

  &.nsfw {
    background: @background;

    img {
      filter: blur(40px);
    }
  }
}
</style>
