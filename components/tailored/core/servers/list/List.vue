<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'

import { Server } from './types'

export default Vue.extend({
  data() {
    return {
      servers: [
        {
          name: 'Solana Fans',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        },
        {
          name: 'Satellite.im',
          address: '0x00000000219ab540356cbb839cbe05303d7705fa',
        },
        {
          name: 'Gaming',
          address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
        },
        {
          name: 'Blockchain Devs',
          address: '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
        },
      ] as Array<Server>,
    }
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
