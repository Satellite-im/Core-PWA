<template src="./Error.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * Text that should be included in the error.
     */
    text: {
      type: String,
      default() {
        return this.$t('internal.missing_text')
      },
    },
  },
})
</script>
<style scoped lang="less" src="./Error.less"></style>
