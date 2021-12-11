<template src="./Label.html" />
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * Text to be included in the label
     */
    text: {
      type: String,
      default: function () {
        return this.$t('internal.missing_text')
      },
    },
  },
})
</script>
<style scoped lang="less" src="./Label.less"></style>
