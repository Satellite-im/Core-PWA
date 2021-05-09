<template>
  <div class="separator">{{ $dayjs(value).format('MMMM DD') }}</div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
})
</script>
<style scoped lang="less" src="./HorizontalRuleText.less"></style>
