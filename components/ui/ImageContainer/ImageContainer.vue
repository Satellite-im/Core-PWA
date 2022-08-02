<template>
  <div class="image-container" :class="{ 'image-container-nsfw': nsfw }">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    nsfw: {
      type: Boolean,
      default: false,
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

  &-nsfw {
    background-color: @background;
    background-image: none;

    img {
      filter: blur(40px);
    }
  }
}
</style>
