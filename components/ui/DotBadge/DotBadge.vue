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

<style scoped lang="less" src="./DotBadge.less"></style>
