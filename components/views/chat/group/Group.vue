<template src="./Group.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { Group } from '~/types/messaging'
import { getUsernameFromState } from '~/utilities/Messaging'
import { GroupMember } from '~/store/groups/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      friends: (state) => (state as RootState).friends,
      accounts: (state) => (state as RootState).accounts,
      groups: (state) => (state as RootState).groups,
    }),
    ...mapGetters('friends', ['findFriendByKey']),
    ...mapGetters('settings', ['getTimestamp']),
    username(): string {
      return (
        this.groupMember?.name ||
        getUsernameFromState(this.group.from, this.$store.state)
      )
    },
    badge(): string {
      return ''
    },
    src(): string {
      if (!this.group?.avatar) {
        return ''
      }
      // To check if the sender is you we just compare the from field
      // with your textile public key
      if (this.group.from === this.$TextileManager?.getIdentityPublicKey()) {
        const myHash = this.accounts.details?.profilePicture
        return myHash ? `${this.$Config.textile.browser}/ipfs/${myHash}` : ''
      }

      // Try to find the group chat member
      const photoHash = this.groupMember?.photoHash
      if (photoHash) {
        return `${this.$Config.textile.browser}/ipfs/${photoHash}`
      }

      // Try to find the friend you are talking to
      const friend = this.findFriendByKey(this.group.from)

      if (friend?.profilePicture) {
        return `${this.$Config.textile.browser}/ipfs/${friend?.profilePicture}`
      }

      return ''
    },
    groupMember(): GroupMember | undefined {
      return this.groups.all
        .find((it) => it.id === this.groupId)
        ?.members?.find((it: GroupMember) => it.address === this.group.sender)
    },
    timestamp(): string {
      return this.getTimestamp({ time: this.group.at })
    },
    address(): string {
      if (this.group.sender) {
        return this.group.sender
      }
      if (this.group.from === this.accounts.details?.textilePubkey) {
        return this.accounts.details?.address
      }
      const friend = this.findFriendByKey(this.group.from)
      return friend?.address ?? ''
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
    showQuickProfile(e: MouseEvent) {
      const openQuickProfile = () => {
        this.$store.dispatch('ui/showQuickProfile', {
          textilePublicKey: this.group.from,
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
  },
})
</script>
<style scoped lang="less" src="./Group.less"></style>
