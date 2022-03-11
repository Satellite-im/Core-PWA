<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Config } from '~/config'
import { Group } from '~/types/messaging'
import {
  getUsernameFromState,
  getAddressFromState,
  refreshTimestampInterval,
} from '~/utilities/Messaging'
import { GroupMemberInfo } from '~/store/groups/types'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => ({
        at: 0,
        from: '',
        to: '',
      }),
    },
    groupId: {
      type: String as PropType<string>,
      default: () => '',
    },
  },
  data() {
    return {
      timestampRefreshInterval: null,
      timestamp: this.$dayjs(this.group.at).fromNow(),
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'accounts', 'groups']),
    address() {
      const address = this.getGroupMember(this.group.sender)?.name
      return address || getAddressFromState(this.group.from, this.$store.state)
    },
    username() {
      const name = this.getGroupMember(this.group.sender)?.name
      return name || getUsernameFromState(this.group.from, this.$store.state)
    },
    badge() {
      return ''
    },
    src(): string {
      // To check if the sender is you we just compare the from field
      // with your textile public key
      if (this.group.from === this.$TextileManager?.getIdentityPublicKey()) {
        const myHash = this.accounts.details?.profilePicture
        return myHash ? `${this.$Config.textile.browser}/ipfs/${myHash}` : ''
      }

      // Try to find the group chat member
      const photoHash = this.getGroupMember(this.group.sender)?.photoHash
      if (photoHash) {
        return `${this.$Config.textile.browser}/ipfs/${photoHash}`
      }

      // Try to find the friend you are talking to
      const friend = this.$Hounddog.findFriend(this.group.from, this.friends)

      if (friend?.profilePicture) {
        return `${this.$Config.textile.browser}/ipfs/${friend?.profilePicture}`
      }

      return ''
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
  beforeUnmount() {
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
    showQuickProfile(e: MouseEvent) {
      const openQuickProfile = () => {
        this.$store.dispatch('ui/showQuickProfile', {
          textilePublicKey: this.$props.group.from,
          position: { x: e.x, y: e.y },
        })
      }

      if (!this.ui.quickProfile) {
        openQuickProfile()
        return
      }
      setTimeout(() => {
        if (!this.ui.quickProfile) {
          openQuickProfile()
        }
      }, 0)
    },
    getGroupMember(address: string): GroupMemberInfo | void {
      if (this.groupId) {
        const group = this.groups.all.find((it) => it.id === this.groupId)
        console.log('group', group)
        return group?.membersInfo?.find((it) => it.address === address)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
