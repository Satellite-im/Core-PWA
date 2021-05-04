<template>
  <font-awesome-icon :icon="['far', 'spinner-third']" :spin="spinning" />
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * Should the loading spinner be animated
     */
    spinning: Boolean,
  },
})
</script>
<style scoped lang="less"></style>
