<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { XIcon } from 'satellite-lucide-icons'

type Account = {
  name: string
  icon: string
  username: string
  isVerified: boolean
  displayOnProfile: boolean
  verifyUrl: string
}

export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    account: {
      type: Object as PropType<Account>,
      required: true,
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
