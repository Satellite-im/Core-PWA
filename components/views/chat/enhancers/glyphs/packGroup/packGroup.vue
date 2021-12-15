<template>
  <v-responsive max-height="100%">
    <v-lazy
      v-model="source.isActive"
      :options="{
        threshold: 0.5,
      }"
      min-height="30"
      transition="fade-transition"
    >
      <EnhancersGlyphsPack :key="source.id" :pack="source" />
    </v-lazy>
  </v-responsive>
</template>

<script lang="ts">
export default {
  name: 'item-component',
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
