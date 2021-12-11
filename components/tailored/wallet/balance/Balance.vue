<template src="./Balance.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  CoinsIcon,
  SendIcon,
  PlusCircleIcon,
  TrendingDownIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    CoinsIcon,
    SendIcon,
    PlusCircleIcon,
    TrendingDownIcon,
  },
  computed: {
    ...mapState(['accounts']),
  },
})
</script>
<style scoped lang="less" src="./Balance.less"></style>
