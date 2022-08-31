<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { CrownIcon, CircleIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/users/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    CrownIcon,
    CircleIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({
        did: '',
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
    creatorBadge: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      loadCheck: false,
    }
  },
  computed: {
    status(): string {
      return iridium.users.ephemeral.status[this.user.did] || 'offline'
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
