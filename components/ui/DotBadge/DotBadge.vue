<template>
  <div class="badge-container">
    <slot />
    <div v-if="props.show" class="badge" />
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="less">
.badge-container {
  position: relative;
  display: flex;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: @flair-color;
  filter: drop-shadow(0px 0px 3px @flair-color);
}
</style>
