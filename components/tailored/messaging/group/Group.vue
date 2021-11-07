<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Group } from '~/types/messaging'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      // default: () => {},
    },
  },
  computed: {
    username() {
      const myAccountDetails = this.$typedStore.state.accounts.details

      const isMe = this.group.from === myAccountDetails?.mailboxId

      if (!isMe) {
        const friend = this.$typedStore.state.friends.all.find(
          (friend) => friend.mailboxId === this.group.from
        )

        return friend?.name || 'uknown'
      } else {
        return myAccountDetails?.name || 'uknown'
      }
    },
    badge() {
      // $mock.users.filter(u => u.address === group.from)[0].badge
      return ''
    },
  },
  methods: {
    /**
     * @method showQuickProfile
     * @description Shows quickprofile component for user by setting quickProfile to true in state and setQuickProfilePosition
     * to the current group components click event data
     * @param e Event object from group component click
     * @example v-on:click="showQuickProfile"
     */
    showQuickProfile(e: Event) {
      this.$store.commit('ui/setQuickProfilePosition', e)
      this.$store.commit('ui/quickProfile', true)
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
