<template src="./Realm.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Config } from '~/config'
import { Realm } from '~/types/ui/realm'

import { SunIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    SunIcon,
  },
  props: {
    realm: {
      type: Object as PropType<Realm>,
      default: () => Config.realms[0],
    },
  },
})
</script>
<style scoped lang="less" src="./Realm.less"></style>
