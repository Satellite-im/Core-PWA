<template>
  <EnhancersGlyphsPack :key="source.id" :pack="source" />
</template>

<script lang="ts">
export default {
  name: 'PackGroup',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    source: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>
