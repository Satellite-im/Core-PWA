<template src="./Add.html"></template>
<script lang="ts">
// @ts-ignore
import QrcodeVue from 'qrcode.vue'

import { UserPlusIcon } from 'satellite-lucide-icons'

import Vue from 'vue'
export default Vue.extend({
  components: {
    QrcodeVue,
    UserPlusIcon,
  },
  data() {
    return {
      value: 'https://example.com',
      size: 150,
    }
  },
})
</script>
<style scoped lang="less" src="./Add.less"></style>
