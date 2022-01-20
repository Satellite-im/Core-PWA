<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Config } from '~/config'
import { Group } from '~/types/messaging'
import { Friend } from '~/types/ui/friends'
import {
  getUsernameFromState,
  getAddressFromState,
  getFullUserInfoFromState,
  refreshTimestampInterval,
} from '~/utilities/Messaging'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      // default: () => {},
    },
  },
  data() {
    return {
      timestampRefreshInterval: null,
      timestamp: this.$dayjs(this.group.at).from(),
    }
  },
  computed: {
    ...mapState(['friends', 'accounts']),
    address() {
      return getAddressFromState(this.group.from, this.$store.state)
    },
    username() {
      return getUsernameFromState(this.group.from, this.$store.state)
    },
    badge() {
      // $mock.users.filter(u => u.address === group.from)[0].badge
      return ''
    },
    src(): string {
      // if sender is you
      if (this.address === 'unknown') {
        const myHash = this.accounts.details.profilePicture
        return myHash ? `${this.$Config.textile.browser}/ipfs/${myHash}` : ''
      }

      const hash = this.friends.all.find(
        (e: Friend) => e.activeChat,
      ).profilePicture

      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  created() {
    const setTimestamp = (timePassed: string) => {
      this.$data.timestamp = timePassed
    }

    this.$data.timestampRefreshInterval = refreshTimestampInterval(
      this.group.at,
      setTimestamp,
      Config.chat.timestampUpdateInterval,
    )
  },
  beforeDestroy() {
    clearInterval(this.$data.refreshTimestampEveryMinute)
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
      const selectedUser = getFullUserInfoFromState(
        this.group.from,
        this.$store.state,
      )
      this.$store.commit('ui/setQuickProfilePosition', e)
      this.$store.commit('ui/quickProfile', selectedUser)
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
