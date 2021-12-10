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
  computed: {
    ...mapState(['friends']),
    /**
     * friendRequestPadding: calculates how much padding to add to a button depending on friendRequest length
     * depending on the number of ongoing friend requests, it will generate a different px amount for padding-right
     */
    friendRequestPadding() {
      const currentIncomingRequests =
        this.friends.incomingRequests.length.toString()
      const length = currentIncomingRequests.length

      if (currentIncomingRequests === '0') {
        return 11
      }

      if (length >= 3) {
        return 46
      }
      return 22 + length * 8
    },
    /**
     * makeFriendReqTag: generates the Request tag number on the Request Button
     * depending on the number of ongoing friend requests, it will generate a different replyLength
     */
    makeFriendReqTag() {
      const replyLength = this.friends.incomingRequests.length
      if (replyLength >= 100) {
        return '99+'
      }
      return replyLength
    },
  },
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
