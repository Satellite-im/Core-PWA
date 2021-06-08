<template src="./Add.html"></template>
<script lang="ts">
// @ts-ignore
import QrcodeVue from 'qrcode.vue'

import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      value: 'https://example.com',
      size: 150,
    }
  },
  components: {
    QrcodeVue,
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
