<template>
  <v-responsive max-height="100%">
    <UiLoadersLoadingInline :count="3" v-if="!source.isActive" />
    <v-lazy
      v-model="source.isActive"
      :options="{
        threshold: 0.5,
      }"
      min-height="30"
      transition="fade-transition"
    >
      <TailoredMessagingEnhancersGlyphsPack :key="source.id" :pack="source" />
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
