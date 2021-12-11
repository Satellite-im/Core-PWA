<template>
  <div id="mini-wallet">
    <TailoredWalletMiniNav :route="route" />
    <TailoredWalletMiniSend v-if="route === 'send'" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      route: 'send',
    }
  },
})
</script>
<style scoped lang="less" src="./Mini.less"></style>