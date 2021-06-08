<template>
  <div class="separator" v-if="plaintext">{{ value }}</div>
  <div class="separator" v-else>{{ $dayjs(value).format('MMMM DD') }}</div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    plaintext: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
})
</script>
<style scoped lang="less" src="./HorizontalRuleText.less"></style>
