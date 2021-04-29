<template>
  <font-awesome-icon :icon="['far', 'spinner-third']" :spin="spinning" />
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    spinning: Boolean,
  },
})
</script>
<style scoped lang="less"></style>
