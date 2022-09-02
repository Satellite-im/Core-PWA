<template>
  <loader-icon :class="spinning ? 'spin' : ''" size="1x" />
</template>
<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { LoaderIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    LoaderIcon,
  },
  props: {
    /**
     * Should the loading spinner be animated
     */
    spinning: Boolean,
  },
})
</script>
<style scoped lang="less"></style>
