<template src="./Nav.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  UserIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserXIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    UserIcon,
    UserCheckIcon,
    UserPlusIcon,
    UserXIcon,
  },
  computed: {
    ...mapState(['friends']),
    /**
     * makeFriendReqTag: generates the Request tag number on the Request Button
     * depending on the number of ongoing friend requests, it will generate a different replyLength
     */
    makeFriendReqTag() {
      const replyLength = this.friends.incomingRequests.length
      if (replyLength > 100) {
        return '99+'
      }
      return replyLength
    },
  },
  props: {
    setRoute: {
      type: Function,
      default: () => () => {},
    },
    route: {
      type: String,
      default: 'active',
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
